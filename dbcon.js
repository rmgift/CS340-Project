var mysql = require('mysql');
var pool = mysql.createPool({
  host            : 'oniddb.cws.oregonstate.edu',
  user            : 'giftr-db',
  password        : '97NozdvDu3yAZKt4',
  database        : 'giftr-db'
});

module.exports.pool = pool;