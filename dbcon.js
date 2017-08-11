var mysql = require('mysql');
/*var pool = mysql.createPool({
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_giftr',
  password        : '97NozdvDu3yAZKt4',
  database        : 'cs340_giftr'
});
module.exports.pool = pool;*/

var pool = mysql.createPool({
 connectionLimit : 10,
 host            : 'classmysql.engr.oregonstate.edu',
 user            : 'cs340_andezach',
 password        : 'H0ck3y28badger',
 database        : 'cs340_andezach'
});
module.exports.pool = pool;
