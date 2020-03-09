const Pool = require('pg').Pool
const pool = new Pool({
  user: 'asaneedle',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

const getTickets = (req, res) => {
  pool.query('SELECT id, content, done FROM tickets ORDER BY id ASC', (err, results) => {
    if (err) {
      console.log(err)
    }
    res.status(200).json(results.rows)
  })
}

const getColumns = (req, res) => {
  pool.query('SELECT id, columnid FROM tickets ORDER BY id ASC', (err, results) => {
    if (err) {
      console.log(err)
    }
    res.status(200).json(results.rows)
  })
}

const createTicket = (request, response) => {
  console.log('querying...')
  const [id, content, done] = request.body
  pool.query('INSERT INTO tickets (id, content, done) VALUES ($1, $2, $3)', [id, content, done], (err, res) => {
    if (err){
      throw err
    } else {
      response.send({text: `I got your ticket and submitted it: ${request.body}`})
    }
  })
}

module.exports = {
  getTickets,
  createTicket,
  getColumns
}



