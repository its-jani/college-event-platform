const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint (Vital for AWS Load Balancers & CloudOps monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// GET: Fetch all college events
app.get('/api/events', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM events ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Add a new college event
app.post('/api/events', async (req, res) => {
  const { title, club_name, date, venue, description } = req.body;

  if (!title || !club_name || !date || !venue) {
    return res.status(400).json({ error: 'Missing required fields: title, club_name, date, venue' });
  }

  try {
    const queryText = `
      INSERT INTO events (title, club_name, date, venue, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [title, club_name, date, venue, description];
    const { rows } = await db.query(queryText, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Express server running on port ${PORT}`);
});
