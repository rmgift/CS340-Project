/*
 * Filename: dbcon.js
 * Authors: Zachary Anderson, Ryan Gift
 * Date: 8/18/17
 * Description: Database credentials to be exported to server.js.
 */

var mysql = require('mysql');
/*var pool = mysql.createPool({
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_giftr',
  password        : 'w3bDevS17',
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
