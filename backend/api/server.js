const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5713',
      'https://literae-ngdw.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Dummy users
const users = [
  { id: 1, username: "alice", password: "123" },
  { id: 2, username: "bob", password: "123" },
];

const profiles = [
  {
    userId: 1,
    fullName: "Alice Johnson",
    address: "123 Maple Street, New York",
    phone: "+1 234 567 890",
    email: "alice@example.com",
  },
  {
    userId: 2,
    fullName: "Bob Smith",
    address: "456 Oak Avenue, Los Angeles",
    phone: "+1 987 654 321",
    email: "bob@example.com",
  },
];

app.get('/', (req, res) => {
  res.send('API is running');
});


app.get("/profile/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const profile = profiles.find((p) => p.userId === userId);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json(profile);
});

let bookmarks = [];
let carts = [];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Username tidak ditemukan" });
  }
  if (user.password !== password) {
    return res.status(401).json({ error: "Password salah" });
  }

  res.json({ id: user.id, username: user.username });
});

app.get("/books", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;

    const q = req.query.q || "";
    const genre = req.query.genre || "";
    const startIndex = parseInt(req.query.startIndex) || 0;
    const maxResults = parseInt(req.query.maxResults) || 10;

    let searchQuery = q || "book";
    if (genre && genre.toLowerCase() !== "all") {
      searchQuery += `+subject:${genre}`;
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      searchQuery
    )}&startIndex=${startIndex}&maxResults=${maxResults}&key=${
      process.env.GOOGLE_BOOKS_KEY_3
    }`;

    console.log("URL:", url);


    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch from Google Books API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Book detail
app.get("/books/:id", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const id = req.params.id;
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.GOOGLE_BOOKS_KEY_3}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch book detail" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/bookmarks/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  res.json(bookmarks.filter((b) => b.userId === userId));
});

app.post("/bookmarks", (req, res) => {
  const { userId, book } = req.body;
  bookmarks.push({ userId, ...book });
  res.json({ success: true });
});

app.delete("/bookmarks/:userId/:bookId", (req, res) => {
  const { userId, bookId } = req.params;
  bookmarks = bookmarks.filter(
    (b) => !(b.userId === parseInt(userId) && b.id === bookId)
  );
  res.json({ success: true });
});

// ----------------- Cart CRUD -----------------
app.get("/cart/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  res.json(carts.filter((c) => c.userId === userId));
});

app.post("/cart", (req, res) => {
  const { userId, book, quantity } = req.body;
  carts.push({ userId, quantity: quantity || 1, ...book });
  res.json({ success: true });
});

app.put("/cart/:userId/:bookId", (req, res) => {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;
  carts = carts.map((c) =>
    c.userId === parseInt(userId) && c.id === bookId
      ? { ...c, quantity }
      : c
  );
  res.json({ success: true });
});

app.delete("/cart/:userId/:bookId", (req, res) => {
  const { userId, bookId } = req.params;
  carts = carts.filter(
    (c) => !(c.userId === parseInt(userId) && c.id === bookId)
  );
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
