const express = require('express');
const mysql = require('mysql');
const pool  = mysql.createPool({
  host     : 'db',
  user     : 'wiki',
  password : 'wiki',
  database : 'wikipedia'
});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/search/:term', (req, res) => {
  pool.getConnection((err, connection) => {
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
      connection.release();
      if (error) throw error;
      res.json(results.map((result) => {
        return {
          lang: result.lang.toString(),
          title: result.title.toString()
        }
      }))
    });
  });
});

app.listen(8080, _ => {
  console.log('App is running!');
});
