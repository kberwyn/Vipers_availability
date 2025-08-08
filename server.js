const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Rugby Availability API is running!' });
});

// Get all players
app.get('/api/players', async (req, res) => {
  const { data, error } = await supabase
    .from('Players')
    .select('*')
    .order('last_name');
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get all matches
app.get('/api/matches', async (req, res) => {
  const { data, error } = await supabase
    .from('Match')
    .select('*')
    .order('date');
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Submit availability
app.post('/api/availability', async (req, res) => {
  const { player_id, match_id, availability, notes } = req.body;
  
  const { data, error } = await supabase
    .from('Availability')
    .upsert({ player_id, match_id, availability, notes });
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
