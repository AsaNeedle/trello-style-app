const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/tickets', db.getTickets)

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body)
  res.send(`I received your POST request, this is what you sent me: ${req.body.post}`)
});

app.post('/api/tickets', (req, res) => {
  console.log(req.body)
  res.send(`I received your ticket, this is the ticket: ${req.body.post}`)
})

app.listen(port, () => console.log(`Listening on port ${port}`));