const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with optional search and filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, type } = req.query;
    let query = { status: 'open' };

    // Search query match (regex)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Type filter match (freelancer, fullTime, partTime)
    if (type && type !== 'all') {
      query.type = type;
    }

    const jobs = await Job.find(query).populate('client', 'firstName lastName email').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get individual job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('client', 'firstName lastName email');
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Client only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, type } = req.body;

    const job = await Job.create({
      title,
      description,
      budget,
      type,
      client: req.user.id,
    });

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Freelancer only)
exports.applyToJob = async (req, res) => {
  try {
    const { coverLetter, bidAmount } = req.body;
    const jobId = req.params.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if freelancer already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      freelancer: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    const application = await Application.create({
      job: jobId,
      freelancer: req.user.id,
      coverLetter,
      bidAmount,
    });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications for a job
// @route   GET /api/jobs/:id/applications
// @access  Private (Client owner only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job',
      });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('freelancer', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/jobs/applications/:id
// @access  Private (Client owner only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify client ownership of job
    if (application.job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this application',
      });
    }

    application.status = status;
    await application.save();

    // If accepted, update the job status to 'in-progress'
    if (status === 'accepted') {
      await Job.findByIdAndUpdate(application.job._id, { status: 'in-progress' });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs posted by the logged in client
// @route   GET /api/jobs/client/all
// @access  Private (Client only)
exports.getClientJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications submitted by the logged in freelancer
// @route   GET /api/jobs/freelancer/applications
// @access  Private (Freelancer only)
exports.getFreelancerApplications = async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'firstName lastName email',
        },
      })
      .sort('-createdAt');
    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


