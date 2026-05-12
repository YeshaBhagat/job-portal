const express = require('express');
const Job = require('../models/Job');
const { protect, recruiterOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all active jobs with search & filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, type, category, experience, location, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (type) query.type = type;
    if (category) query.category = category;
    if (experience) query.experience = experience;
    if (location) query.location = { $regex: location, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company companyWebsite');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Recruiters only)
router.post('/', protect, recruiterOnly, async (req, res) => {
  try {
    const {
      title, company, location, type, category, description,
      requirements, responsibilities, salaryMin, salaryMax, experience, deadline,
    } = req.body;

    const job = await Job.create({
      title, company, location, type, category, description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      experience: experience || 'Fresher',
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Job owner only)
router.put('/:id', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Job owner only)
router.delete('/:id', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/recruiter/myjobs
// @desc    Get all jobs posted by logged-in recruiter
// @access  Private (Recruiter)
router.get('/recruiter/myjobs', protect, recruiterOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
