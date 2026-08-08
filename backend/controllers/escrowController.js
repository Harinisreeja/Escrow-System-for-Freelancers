const Escrow = require('../models/Escrow');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create an Escrow contract (Locks funds from client balance)
// @route   POST /api/escrow/create
// @access  Private (Client only)
exports.createEscrow = async (req, res) => {
  try {
    const { jobId, freelancerId, amount, applicationId } = req.body;

    // Check if job exists and belongs to client
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to create escrow for this job' });
    }

    // Check if client has sufficient balance
    const client = await User.findById(req.user.id);
    if (client.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance to fund this escrow contract' });
    }

    // Check if freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ success: false, message: 'Freelancer not found' });
    }

    // Create the Escrow
    const escrow = await Escrow.create({
      job: jobId,
      client: req.user.id,
      freelancer: freelancerId,
      amount,
      status: 'locked',
    });

    // Deduct from client balance
    client.balance -= amount;
    await client.save();

    // Mark job as in-progress (if not already)
    job.status = 'in-progress';
    await job.save();

    res.status(201).json({
      success: true,
      escrow,
      clientBalance: client.balance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Release Escrow funds to Freelancer
// @route   POST /api/escrow/:id/release
// @access  Private (Client only)
exports.releaseEscrow = async (req, res) => {
  try {
    const escrow = await Escrow.findById(req.params.id);
    
    if (!escrow) {
      return res.status(404).json({ success: false, message: 'Escrow contract not found' });
    }

    // Only client who funded it can release it
    if (escrow.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to release these funds' });
    }

    if (escrow.status !== 'locked') {
      return res.status(400).json({ success: false, message: `Cannot release funds, escrow is already: ${escrow.status}` });
    }

    // Mark escrow as released
    escrow.status = 'released';
    await escrow.save();

    // Transfer money to freelancer balance
    const freelancer = await User.findById(escrow.freelancer);
    freelancer.balance += escrow.amount;
    await freelancer.save();

    // Mark job as completed
    await Job.findByIdAndUpdate(escrow.job, { status: 'completed' });

    res.status(200).json({
      success: true,
      escrow,
      message: `Funds of $${escrow.amount} successfully released to ${freelancer.firstName} ${freelancer.lastName}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refund Escrow funds back to Client
// @route   POST /api/escrow/:id/refund
// @access  Private (Client only)
exports.refundEscrow = async (req, res) => {
  try {
    const escrow = await Escrow.findById(req.params.id);
    
    if (!escrow) {
      return res.status(404).json({ success: false, message: 'Escrow contract not found' });
    }

    // Only client who funded it can trigger refund
    if (escrow.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to request refund' });
    }

    if (escrow.status !== 'locked') {
      return res.status(400).json({ success: false, message: `Cannot refund, escrow is already: ${escrow.status}` });
    }

    // Mark escrow as refunded
    escrow.status = 'refunded';
    await escrow.save();

    // Return funds to client balance
    const client = await User.findById(escrow.client);
    client.balance += escrow.amount;
    await client.save();

    // Reopen job status
    await Job.findByIdAndUpdate(escrow.job, { status: 'open' });

    res.status(200).json({
      success: true,
      escrow,
      clientBalance: client.balance,
      message: `Funds of $${escrow.amount} successfully refunded to your wallet`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's escrows (as freelancer or client)
// @route   GET /api/escrow/user
// @access  Private
exports.getUserEscrows = async (req, res) => {
  try {
    let escrows;
    if (req.user.role === 'client') {
      escrows = await Escrow.find({ client: req.user.id })
        .populate('job', 'title')
        .populate('freelancer', 'firstName lastName email')
        .sort('-createdAt');
    } else {
      escrows = await Escrow.find({ freelancer: req.user.id })
        .populate('job', 'title')
        .populate('client', 'firstName lastName email')
        .sort('-createdAt');
    }

    res.status(200).json({
      success: true,
      count: escrows.length,
      escrows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
