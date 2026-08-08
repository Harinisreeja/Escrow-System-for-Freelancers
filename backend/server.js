const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/contact', contactRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Escrow System API is running...');
});

// Seed Database Function
const seedDatabase = async () => {
  try {
    const User = require('./models/User');
    const Job = require('./models/Job');

    // Check if jobs exist
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('Seeding database with default users and jobs...');
      
      // Create default client
      let clientUser = await User.findOne({ email: 'client@escrow.com' });
      if (!clientUser) {
        clientUser = new User({
          firstName: 'Robert',
          lastName: 'Fox',
          email: 'client@escrow.com',
          password: 'password123',
          role: 'client',
          balance: 15000,
        });
        await clientUser.save();
      }

      // Create default freelancer
      let freelancerUser = await User.findOne({ email: 'freelancer@escrow.com' });
      if (!freelancerUser) {
        freelancerUser = new User({
          firstName: 'Kristin',
          lastName: 'Watson',
          email: 'freelancer@escrow.com',
          password: 'password123',
          role: 'freelancer',
          balance: 2500,
        });
        await freelancerUser.save();
      }

      // Seed jobs
      const defaultJobs = [
        {
          title: 'Web Developer',
          description: 'We are looking for a skilled Web Developer to join our team. You will be responsible for developing and maintaining high-quality web applications using modern web technologies. Experience with database design and API integrations is highly desired.',
          budget: 1500,
          type: 'fullTime',
          client: clientUser._id,
        },
        {
          title: 'Freelancer Copywriter',
          description: 'Need a creative writer to craft engaging blog posts, landing page copy, and email marketing campaigns. You must have a strong portfolio demonstrating your writing style and ability to explain complex technical products in simple words.',
          budget: 1100,
          type: 'freelancer',
          client: clientUser._id,
        },
        {
          title: 'Business Associate',
          description: 'Assist in business operations, client communication, marketing proposals, and report generations. Strong organizational and communication skills are required. Experience in freelancing systems or escrow services is a plus.',
          budget: 1000,
          type: 'partTime',
          client: clientUser._id,
        },
        {
          title: 'Digital Marketing Specialist',
          description: 'Looking for a digital marketer to drive user acquisition. Familiarity with SEO, Google Ads, Meta Ads, and content marketing is required. Set up tracking campaigns and report on performance metrics weekly.',
          budget: 1300,
          type: 'fullTime',
          client: clientUser._id,
        },
        {
          title: 'User Experience Designer',
          description: 'Help redesign our client dashboard to simplify payments and contract creation. Build wireframes and clickable high-fidelity prototypes. Experience with dark themes and modern clean aesthetics is a must.',
          budget: 1200,
          type: 'partTime',
          client: clientUser._id,
        },
      ];

      await Job.insertMany(defaultJobs);
      console.log('Database seeded successfully with default users and jobs!');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Run seed check after DB connection starts
const mongoose = require('mongoose');
mongoose.connection.once('open', () => {
  seedDatabase();
});


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
