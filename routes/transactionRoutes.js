const express = require('express');
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactionController');
const authenticate = require('../middleware/authMiddleware');

// Protect all transaction routes
router.use(authenticate);

router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/summary', getSummary);

module.exports = router;
