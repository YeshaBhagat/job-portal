const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    category: {
      type: String,
      enum: [
        'Technology',
        'Marketing',
        'Finance',
        'Design',
        'Sales',
        'HR',
        'Operations',
        'Other',
      ],
      default: 'Technology',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    experience: {
      type: String,
      enum: ['Fresher', '1-2 years', '2-5 years', '5+ years'],
      default: 'Fresher',
    },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
