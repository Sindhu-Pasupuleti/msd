// index.js

const express = require('express');
const path = require('path');

const app = express();

const idFilter = req => member => member.id === parseInt(req.params.id);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
];

const PORT = process.env.PORT || 3001;

// Define a route for the root path
app.get('/', (req, res) => {
  res.send('Hello, this is the root path!');
});

// Serve static files from the public directory

// GET All USERS
app.get('/api/users', (req, res) => res.json(users));

// GET Specific USER Based on ID
app.get('/api/users/:id', (req, res) => {
  const found = users.some(idFilter(req));

  if (found) {
    res.json(users.filter(idFilter(req)));
  } else {
    res.status(404).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// CREATE A NEW USER
app.post('/api/users', (req, res) => {
  const newMember = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    status: 'guest'
  };

  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: 'NAME and EMAIL must be provided' });
  }

  users.push(newMember);
  res.json(users);
});

// DELETE Specific USER Based on ID
app.delete('/api/users/:id', (req, res) => {
  const found = users.some(idFilter(req));

  if (found) {
    users = users.filter(member => member.id !== parseInt(req.params.id));
    res.json({ msg: 'Deleted', members: users });
  } else {
    res.status(404).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// UPDATE Specific USER Based on ID
app.put('/api/users/:id', (req, res) => {
  const found = users.some(member => member.id === parseInt(req.params.id));

  if (found) {
    const updMember = req.body;

    users = users.map(member => {
      if (member.id === parseInt(req.params.id)) {
        member.name = updMember.name || member.name;
        member.email = updMember.email || member.email;
      }
      return member;
    });

    res.json({ msg: 'Updated Details', members: users });
  } else {
    res.status(404).json({ msg: `No User found with ${req.params.id}` });
  }
});

app.listen(PORT, () => console.log(`Server is Running ${PORT}`));
