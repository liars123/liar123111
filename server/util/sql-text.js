const conn = require('./sql.js');

conn.query('select * from user',(err,result) => {
    console.log(err)
    console.log(result)
})