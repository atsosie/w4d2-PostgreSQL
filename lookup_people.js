const db = require("./db");

const lookupName = process.argv[2];

function findPersonByName(lookupName, done) {
  db.connect((err, client) => {
    client.query("SELECT id, first_name, last_name, to_char(birthdate, 'YYYY-MM-DD') birthdate FROM famous_people WHERE first_name = $1::text OR last_name = $1::text", [lookupName], (err, queryResult) => {
      done(err, queryResult);
      client.end();
    });
  });
}

function logOutputHeader(queryResult) {
  console.log("Searching ...");
  console.log(`Found ${queryResult.rows.length} person(s) by the name '${lookupName}'`);
}

function logPersonInfo(queryResult) {
  for (idx in queryResult.rows) {
    let person = {
      id: queryResult.rows[idx].id,
      first_name: queryResult.rows[idx].first_name,
      last_name: queryResult.rows[idx].last_name,
      birthdate: queryResult.rows[idx].birthdate
    };
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born '${person.birthdate}'`);
  }
}


findPersonByName(lookupName, (err, queryResult) => {
  if (process.argv.length !== 3) {
    console.log("Usage: node lookup_people.js <name>");
    process.exit(1);
  }
  if (err) {
    return console.error("error running query", err);
  }
  logOutputHeader(queryResult);
  logPersonInfo(queryResult);
});