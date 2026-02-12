import express from 'express';
const router = express.Router();
import Collection from '../models/Collection.js';
import Request from '../models/Request.js';
import auth from '../middleware/auth.js';

// Get all collections
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user.id });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create collection
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCollection = new Collection({
      userId: req.user.id,
      name,
      description
    });
    const savedCollection = await newCollection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update collection
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description },
      { new: true }
    );
    if (!updatedCollection) return res.status(404).json({ error: 'Collection not found' });
    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete collection and all its requests
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedCollection = await Collection.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedCollection) return res.status(404).json({ error: 'Collection not found' });
    
    // Delete associated requests
    await Request.deleteMany({ collectionId: req.params.id, userId: req.user.id });
    
    res.status(200).json({ message: 'Collection and associated requests deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
