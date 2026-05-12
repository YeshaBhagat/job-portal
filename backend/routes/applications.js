const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, recruiterOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/applications/:jobId
// @desc    Apply for a job
// @access  Private (Job Seekers)
router.post('/:jobId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seeker') {
      return res.status(403).json({ message: 'Only job seekers can apply' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or no longer active' });
    }

    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || '',
      resumeLink: req.body.resumeLink || '',
    });

    // Increment applicants count
    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicantsCount: 1 } });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/my
// @desc    Get all applications of the logged-in seeker
// @access  Private (Seeker)
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salaryMin salaryMax isActive')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job (recruiter)
// @access  Private (Recruiter - job owner)
router.get('/job/:jobId', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email bio skills resume')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Recruiter)
router.put('/:id/status', protect, recruiterOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = req.body.status || application.status;
    application.recruiterNote = req.body.recruiterNote || application.recruiterNote;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application (seeker)
// @access  Private (Seeker)
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await application.deleteOne();
    await Job.findByIdAndUpdate(application.job, { $inc: { applicantsCount: -1 } });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
