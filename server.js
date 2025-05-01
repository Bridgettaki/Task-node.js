const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Sample data
let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "Interstellar", director: "Christopher Nolan", year: 2014 }
];

let series = [
  { id: 1, title: "Breaking Bad", seasons: 5, creator: "Vince Gilligan" },
  { id: 2, title: "Stranger Things", seasons: 4, creator: "The Duffer Brothers" }
];

let songs = [
  { id: 1, title: "Bohemian Rhapsody", artist: "Queen", year: 1975 },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", year: 2020 }
];

// Helper function
const getResourceArray = (type) => {
  return { movies, series, songs }[type];
};

// CRUD handlers
["movies", "series", "songs"].forEach((type) => {
  app.get(`/${type}`, (req, res) => {
    res.json(getResourceArray(type));
  });

  app.post(`/${type}`, (req, res) => {
    const newItem = req.body;
    const list = getResourceArray(type);
    newItem.id = list.length ? list[list.length - 1].id + 1 : 1;
    list.push(newItem);
    res.status(201).json(list);
  });

  app.put(`/${type}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    let list = getResourceArray(type);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedItem };
      res.json(list);
    } else {
      res.status(404).json({ message: `${type.slice(0, -1)} not found` });
    }
  });

  app.delete(`/${type}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    let list = getResourceArray(type);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
      res.json(list);
    } else {
      res.status(404).json({ message: `${type.slice(0, -1)} not found` });
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
