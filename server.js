const express = require('express')
const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

const app = express()

app.get('/', (req, res) => {
  res.send('Go search on /search/:term')
})

app.get('/search/:term', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw new Error(err)
    connection.query(`
      SELECT ll_lang as lang, ll_title as title
        FROM langlinks
        WHERE ll_from = (
          SELECT page_id
            FROM page
            WHERE page_namespace = 0 /* NS_MAIN */
              AND page_title = ?
            LIMIT 1
        )
        `, [req.params.term],
    (error, results, fields) => {
      connection.release()
      if (error) throw error
      const mp = results.reduce((map, r) => {
        map[r.lang.toString()] = r.title.toString()
        return map
      }, {})
      // NOTE `new Map()` seems not working with res.json()
      res.json(mp)
    })
  })
})

app.listen(process.env.PORT, () => {
  console.log('App is running!')
})
