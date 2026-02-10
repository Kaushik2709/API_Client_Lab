import express from 'express';
const router = express.Router();
import { executeRequest } from '../services/requestExecutor.js';
import Request from '../models/Request.js';
import auth from '../middleware/auth.js';

// Execute request (does not save to DB)
router.post('/execute', async (req, res) => {
  try {
    const result = await executeRequest(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save request (Create or Update)
router.post('/save', auth, async (req, res) => {
  try {
    const { id, name, method, url, headers, body, auth: requestAuth, collectionId } = req.body;
    
    if (id) {
      const updatedRequest = await Request.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { name, method, url, headers, body, auth: requestAuth, collectionId },
        { new: true }
      );
      if (!updatedRequest) return res.status(404).json({ error: 'Request not found' });
      return res.status(200).json(updatedRequest);
    }

    const newRequest = new Request({
      userId: req.user.id,
      name,
      method,
      url,
      headers,
      body,
      auth: requestAuth,
      collectionId
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all requests for user (History or Collections)
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get request by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.id, userId: req.user.id });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete request
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedRequest = await Request.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedRequest) return res.status(404).json({ error: 'Request not found' });
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

