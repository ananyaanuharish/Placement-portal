
const mysql = require('mysql2');

//shreyas db
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Lingaiah@60',
//     database: 'PLACEMENT', //RV_COLLEGE_PLACEMENT
// });

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,  // Use the environment variable
  database: process.env.DB,
  port: process.env.PORT,
});

////sanjana db
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Lingaiah@60',
//   database: 'team_database',
// });


db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
});

module.exports = db;
