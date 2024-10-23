const db = require('../database/db');

// Add a new transaction
exports.addTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO transactions (user_id, type, category, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, type, category, amount, date, description],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(201).json({ id: this.lastID });
    }
  );
};

// Get all transactions for the logged-in user
exports.getTransactions = (req, res) => {
  db.all(`SELECT * FROM transactions WHERE user_id = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
};

// Get a single transaction by ID
exports.getTransaction = (req, res) => {
  db.get(`SELECT * FROM transactions WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send('Transaction not found');
    res.json(row);
  });
};

// Update a transaction by ID
exports.updateTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;

  db.run(
    `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ? AND user_id = ?`,
    [type, category, amount, date, description, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      if (this.changes === 0) return res.status(404).send('Transaction not found');
      res.send('Transaction updated successfully');
    }
  );
};

// Delete a transaction by ID
exports.deleteTransaction = (req, res) => {
  db.run(`DELETE FROM transactions WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0) return res.status(404).send('Transaction not found');
    res.send('Transaction deleted successfully');
  });
};

// Get summary of transactions
exports.getSummary = (req, res) => {
  const { category, startDate, endDate } = req.query;
  let query = `SELECT type, SUM(amount) as total FROM transactions WHERE user_id = ?`;
  const params = [req.user.id];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' GROUP BY type';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send(err.message);

    const summary = {
      total_income: rows.find(row => row.type === 'income')?.total || 0,
      total_expenses: rows.find(row => row.type === 'expense')?.total || 0,
    };
    summary.balance = summary.total_income - summary.total_expenses;

    res.json(summary);
  });
};
