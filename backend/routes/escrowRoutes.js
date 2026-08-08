const express = require('express');
const router = express.Router();
const {
  createEscrow,
  releaseEscrow,
  refundEscrow,
  getUserEscrows,
} = require('../controllers/escrowController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/user', getUserEscrows);
router.post('/create', authorize('client'), createEscrow);
router.post('/:id/release', authorize('client'), releaseEscrow);
router.post('/:id/refund', authorize('client'), refundEscrow);

module.exports = router;
