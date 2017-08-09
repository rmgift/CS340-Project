var mysql = require('mysql');
var pool = mysql.createPool({
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_giftr',
  password        : '97NozdvDu3yAZKt4',
  database        : 'cs340_giftr'
});

module.exports.pool = pool;
