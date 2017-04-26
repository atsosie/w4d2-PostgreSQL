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

if (process.argv.length !== 5) {
  console.log("Usage: node add_person.js <first name> <last name> <YYY-MM-DD>");
  process.exit(1);
}

knex.insert([{first_name: process.argv[2], last_name: process.argv[3], birthdate: process.argv[4]}]).into("famous_people").then(function(id) {
  console.log(id);
});

knex.destroy();