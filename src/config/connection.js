const mysql      = require('mysql');
const util = require('util');

// clever cloud old
/*
const con = mysql.createConnection({
  host     : 'bklb0otatxag0a1qv5gj-mysql.services.clever-cloud.com',
  user     : 'ux182sgoiygo7lte',
  password : 'ZjxbAAAvCdvRz3fFUVEY',
  database : 'bklb0otatxag0a1qv5gj'
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

const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ibee_actualizada_nueva_2'
});


module.exports ={
    con,
    query( sql, args ) {
      return util.promisify( con.query )
        .call( con, sql, args );
    },
}