var config = {
	host: 'localhost',
	user: 'user',
	password: 'password',
	database: 'sqlInjectionTable'
};
var crypto = require('crypto');

// Connect to the MySQL database using knex.
var db = require('knex')({
	client: 'mysql',
	connection: config
});

var mysql = require('mysql');

db.connection = mysql.createConnection(config);

// Create the "users" database table.
db.schema.createTableIfNotExists('users', function (table) {

	// Define the structure ("schema") of the users table.
	table.increments('id').primary();
	table.string('username');
	table.string('password');

	// Count the number of records in the users table.
	db('users').count().then(function (results) {

		var count = results[0]['count(*)'];

		if (count > 0) {
			// Already populated.
			return;
		}

		// Populate the new table with some sample data.
		db('users').insert([
			{ username: 'test', password: 'test' },
			{ username: 'some_user', password: '12345' }
		]).catch(console.log);
	}).catch(console.log);
}).catch(console.log);

//secure user table
db.schema.createTableIfNotExists('userssecure', function (table) {

	// Define the structure ("schema") of the users table.
	table.increments('id').primary();
	table.string('username');
	table.string('password');

	// Count the number of records in the users table.
	db('userssecure').count().then(function (results) {

		var count = results[0]['count(*)'];

		if (count > 0) {
			// Already populated.
			return;
		}

		// Populate the new table with some sample data.
		db('userssecure').insert([
			{ username: 'test', password: crypto.createHash('md5').update('test').digest('hex') },
			{ username: 'some_user', password: crypto.createHash('md5').update('1234').digest('hex') }
		]).catch(console.log);
	}).catch(console.log);
}).catch(console.log);

function blockIpAddress(id) {

	db('blocked').insert([
		{ id, timestamp: new Date() },
	]).catch(console.log);
}

async function checkIfIpAddressIsBlocked(id) {
	console.log("Checking if IP is blocked...")
	var sql = 'SELECT * FROM blocked WHERE id = "' + id + '"';
	try {
		let status = await db.connection.query(sql, function (error, results) {
			return results
		});

		return status
	}
	catch (e) {
		return false;
	}


}

module.exports = { blockIpAddress, checkIfIpAddressIsBlocked }