const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  applyToJob,
  getJobApplications,
  updateApplicationStatus,
  getClientJobs,
  getFreelancerApplications,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, authorize('client'), createJob);
router.route('/client/all').get(protect, authorize('client'), getClientJobs);
router.route('/freelancer/applications').get(protect, authorize('freelancer'), getFreelancerApplications);
router.route('/:id').get(getJob);
router.route('/:id/apply').post(protect, authorize('freelancer'), applyToJob);
router.route('/:id/applications').get(protect, authorize('client'), getJobApplications);
router.route('/applications/:id').put(protect, authorize('client'), updateApplicationStatus);

module.exports = router;


