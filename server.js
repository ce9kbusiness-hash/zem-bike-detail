const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

// POST /api/bookings - Create a new booking
app.post('/api/bookings', (req, res) => {
    const booking = req.body;

    if (!booking.service || !booking.date || !booking.time || !booking.name || !booking.phone || !booking.bike) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    booking.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    bookings.push(booking);
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));

    res.status(201).json({ success: true, id: booking.id });
});

// GET /api/bookings - List all bookings
app.get('/api/bookings', (req, res) => {
    const bookings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(bookings);
});

// DELETE /api/bookings/:id - Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
    let bookings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings.splice(index, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`ZEM Bike Detail server running at http://localhost:${PORT}`);
});
