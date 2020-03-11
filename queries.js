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
  pool.query('SELECT columnid, title FROM columns ORDER BY columnid ASC', (err, results) => {
    if (err) {
      console.log(err)
    }
    res.status(200).json(results.rows)
  })
}

const createTicket = (request, response) => {
  console.log('querying...')
  const [content, done, columnid] = request.body
  pool.query('INSERT INTO tickets (content, done, columnid) VALUES ($1, $2, $3)', [content, done, columnid], (err, res) => {
    if (err){
      throw err
    } else {
      response.send({text: `I got your ticket and submitted it: ${request.body}`})
    }
  })
}

const createColumns = (request, response) => {
  console.log('querying...')
  const title = request.body
  console.log(request.body)
  pool.query('INSERT INTO columns(title) VALUES($1)', title, (err, res) => {
    if (err){
      throw err
    } else {
      response.send({text: `I got your column and submitted it: ${request.body}`})
    }
  })
}

module.exports = {
  getTickets,
  createTicket,
  getColumns,
  createColumns
}



