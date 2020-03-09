const Pool = require('pg').Pool
const pool = new Pool({
  user: 'asaneedle',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

const getTickets = (req, res) => {
  pool.query('SELECT * FROM tickets ORDER BY id ASC', (err, results) => {
    if (err) {
      console.log(err)
    }
    res.status(200).json(results.rows)
  })
}

module.exports = {
  getTickets
}



