const settings = require("./settings"); // settings.json

const connection = {
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
};

const knex = require("knex")({
  client: "pg",
  connection: connection,
  searchPath: "knex,public"
});


if (process.argv.length !== 3) {
  console.log("Usage: node lookup_people_w_knex.js <name>");
  process.exit(1);
}

const lookupName = process.argv[2];


knex.select('id', 'last_name', 'first_name', 'birthdate')
    .from('famous_people')
    .where({first_name: lookupName})
    .orWhere({last_name: lookupName})
    .asCallback(function(err, result) {

  if (err) {
    return console.error("error running query", err);
  }

  console.log("Searching ...");
  console.log("Found " + result.length + " person(s) by the name '" + lookupName + "'");

  for (idx in result) {
    let person = result[idx];
    console.log("- " + person.id + ": " + person.first_name + " " + person.last_name + ", born  " + person.birthdate);
  }

  knex.destroy(function () {});
});

