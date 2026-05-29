const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SESSIONS_FILE = path.join(__dirname, 'data', 'sessions.json');

// Middleware
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname, {
    extensions: ['html'],
    index: 'index.html'
}));

// Ensure data directory and files exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
}
if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, '[]');
}

// ===== Helpers =====
function readJSON(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return [];
    }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// ===== OTP Storage =====
const otpStore = new Map();

function cleanExpiredOtps() {
    const now = Date.now();
    for (const [phone, entry] of otpStore) {
        if (now > entry.expiresAt) otpStore.delete(phone);
    }
}

// ===== Auth Middleware =====
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const sessions = readJSON(SESSIONS_FILE);
    const session = sessions.find(s => s.token === token);
    if (!session) return res.status(401).json({ error: 'Invalid session' });

    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.id === session.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
}

// Optional auth - attaches user if token present, but doesn't block
function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        const sessions = readJSON(SESSIONS_FILE);
        const session = sessions.find(s => s.token === token);
        if (session) {
            const users = readJSON(USERS_FILE);
            req.user = users.find(u => u.id === session.userId) || null;
        }
    }
    next();
}

// ===== Auth Routes =====

// POST /api/auth/request-otp
app.post('/api/auth/request-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    cleanExpiredOtps();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Dev mode: return OTP in response
    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ success: true, otp }); // Remove otp from response in production
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    cleanExpiredOtps();

    const entry = otpStore.get(phone);
    if (!entry || entry.otp !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    otpStore.delete(phone);

    // Find or create user
    let users = readJSON(USERS_FILE);
    let user = users.find(u => u.phone === phone);
    if (!user) {
        user = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            phone,
            points: 0,
            createdAt: new Date().toISOString()
        };
        users.push(user);
        writeJSON(USERS_FILE, users);
    }

    // Create session
    const token = generateToken();
    const sessions = readJSON(SESSIONS_FILE);
    sessions.push({
        token,
        userId: user.id,
        createdAt: new Date().toISOString()
    });
    writeJSON(SESSIONS_FILE, sessions);

    res.json({ success: true, token, user: { id: user.id, phone: user.phone, points: user.points } });
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json({ user: { id: req.user.id, phone: req.user.phone, points: req.user.points } });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        let sessions = readJSON(SESSIONS_FILE);
        sessions = sessions.filter(s => s.token !== token);
        writeJSON(SESSIONS_FILE, sessions);
    }
    res.json({ success: true });
});

// ===== User Routes =====

// GET /api/user/history
app.get('/api/user/history', authMiddleware, (req, res) => {
    const bookings = readJSON(DATA_FILE);
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    res.json({
        bookings: userBookings,
        points: req.user.points
    });
});

// ===== Booking Routes =====

// Explicit route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /api/bookings - Create a new booking
app.post('/api/bookings', optionalAuth, (req, res) => {
    const booking = req.body;

    if (!booking.service || !booking.date || !booking.time || !booking.name || !booking.phone || !booking.bike) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let bookings = readJSON(DATA_FILE);

    booking.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    booking.createdAt = new Date().toISOString();

    // If user is logged in, attach userId and award points
    let pointsAwarded = 0;
    if (req.user) {
        booking.userId = req.user.id;

        // Validate price against known services
        const SERVICE_PRICES = {
            'Basic Wash': 29,
            'Premium Wash': 59,
            'King Wash': 79,
            'Premium Polish': 179,
            'Coating': 279
        };
        pointsAwarded = SERVICE_PRICES[booking.service] || 0;

        let users = readJSON(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === req.user.id);
        if (userIndex !== -1) {
            users[userIndex].points = (users[userIndex].points || 0) + pointsAwarded;
            writeJSON(USERS_FILE, users);
        }
    }

    bookings.push(booking);
    writeJSON(DATA_FILE, bookings);

    res.status(201).json({ success: true, id: booking.id, pointsAwarded });
});

// GET /api/bookings - List all bookings
app.get('/api/bookings', (req, res) => {
    res.json(readJSON(DATA_FILE));
});

// DELETE /api/bookings/:id - Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
    let bookings = readJSON(DATA_FILE);
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings.splice(index, 1);
    writeJSON(DATA_FILE, bookings);
    res.json({ success: true });
});

// Catch-all: serve index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ZEM Bike Detail server running on port ${PORT}`);
});
