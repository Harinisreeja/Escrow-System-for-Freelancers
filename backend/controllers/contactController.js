const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please include name, email, and message' });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received! Our team will contact you shortly.',
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
