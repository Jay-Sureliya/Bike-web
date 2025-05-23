require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Bike = require('../BACKEND/model/bikeschema.js');
const Logo = require('../BACKEND/model/logoschema.js');
const Contact = require('../BACKEND/model/contactschema.js');
const User = require('../BACKEND/model/userschema.js');
const Dealer = require('../BACKEND/model/dealer.js');
const Message = require('../BACKEND/model/message.js');
const accessory = require('../BACKEND/model/accessories.js');
const bcrypt = require("bcryptjs");
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // your React frontend origin
  credentials: true, // allow cookies
}));

app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);


// GET: All bikes
app.get('/api/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Load data from bikes.json into DB
app.get('/api/import-bikes', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('./data/bikes.json', 'utf-8'));
    await Bike.insertMany(data);
    res.json({ message: 'Bikes imported successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET: All Logo
app.get('/api/logo', async (req, res) => {
  try {
    const logos = await Logo.find();
    res.json(logos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Load data from Logo.json into DB
app.get('/api/import-logo', async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, './data/logos.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await Logo.deleteMany(); // Optional: clears old entries
    await Logo.insertMany(data);

    res.json({ message: '✅ Logos imported successfully', count: data.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import logos', details: err.message });
  }
});

app.get('/api/accessories', async (req, res) => {
  try {
    const accessories = await accessory.find();
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/import-accessories", async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, "./data/accessories.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await accessory.deleteMany(); // Optional: clear existing entries
    await accessory.insertMany(data);

    res.json({ message: "✅ Accessories imported successfully", count: data.length });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to import accessories", details: err.message });
  }
});



app.get("/api/import-dealers", async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, "./data/dealers.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Dealer.deleteMany(); // Optional: remove existing dealers
    await Dealer.insertMany(data);

    res.json({ message: "✅ Dealers imported successfully", count: data.length });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to import dealers", details: err.message });
  }
});

// API to get all dealers
app.get("/api/dealers", async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.post('/api/messages', async (req, res) => {
  try {
    const { dealerId, name, email, message } = req.body;
    if (!dealerId || !name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMessage = new Message({ dealerId, name, email, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// 3. POST route to store contact data
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: "Message stored in DB" });
  } catch (err) {
    console.error("Error storing contact:", err);
    res.status(500).json({ success: false, error: "Failed to save" });
  }
});


// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "Registration error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    req.session.user = { id: user._id, email: user.email };
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// Check if logged in
app.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.send({ message: 'Logged out' });
  });
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
