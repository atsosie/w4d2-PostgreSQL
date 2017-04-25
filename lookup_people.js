const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }

  if (process.argv.length !== 3) {
    console.log("Usage: node lookup_people.js <name>");
    process.exit(1);
  }

  const lookupName = process.argv[2];

  client.query("SELECT id, first_name, last_name, to_char(birthdate, 'YYYY-MM-DD') birthdate FROM famous_people WHERE first_name = $1::text OR last_name = $1::text", [lookupName], (err, queryResult) => {

    if (err) {
      return console.error("error running query", err);
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

    logOutputHeader(queryResult);
    logPersonInfo(queryResult);

    client.end();
  });
});