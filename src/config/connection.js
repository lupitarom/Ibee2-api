const mysql      = require('mysql');
const util = require('util');

// clever cloud old

const con = mysql.createConnection({
  host     : 'bpvkezwedayqcxl0xwhy-mysql.services.clever-cloud.com',
  user     : 'uwitrskljcnnlr1e',
  password : '673WVZvQsorvrkv1ijpJ',
  database : 'bpvkezwedayqcxl0xwhy'
}); 
/*
// clever cloud new
const con = mysql.createConnection({
  host     : 'b0ymg7ua1hzq53hzf52c-mysql.services.clever-cloud.com',
  user     : 'ugtrmbw8hgpsiqhj',
  password : '8NBPg9sn3NRPpR0kveLy',
  database : 'b0ymg7ua1hzq53hzf52c'
}); */
// local
/*
const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ibee_actualizada_nueva'
});*/


module.exports ={
    con,
    query( sql, args ) {
      return util.promisify( con.query )
        .call( con, sql, args );
    },
}