const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    resumeLink: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Pending',
    },
    recruiterNote: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
