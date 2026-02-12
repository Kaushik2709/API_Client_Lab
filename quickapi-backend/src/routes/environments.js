import express from 'express';
const router = express.Router();
import Environment from '../models/Environment.js';
import auth from '../middleware/auth.js';

// Get all environments
router.get('/', auth, async (req, res) => {
  try {
    const environments = await Environment.find({ userId: req.user.id });
    res.status(200).json(environments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create environment
router.post('/', auth, async (req, res) => {
  try {
    const { name, variables } = req.body;
    const newEnvironment = new Environment({
      userId: req.user.id,
      name,
      variables
    });
    const savedEnvironment = await newEnvironment.save();
    res.status(201).json(savedEnvironment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update environment
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, variables, isActive } = req.body;
    
    // If setting to active, deactivate others
    if (isActive) {
      await Environment.updateMany({ userId: req.user.id }, { isActive: false });
    }

    const updatedEnvironment = await Environment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, variables, isActive },
      { new: true }
    );
    if (!updatedEnvironment) return res.status(404).json({ error: 'Environment not found' });
    res.status(200).json(updatedEnvironment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete environment
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedEnvironment = await Environment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedEnvironment) return res.status(404).json({ error: 'Environment not found' });
    res.status(200).json({ message: 'Environment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
