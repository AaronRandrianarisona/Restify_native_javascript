let fs = require('fs'),
    router = require(process.cwd() + "/app/core/router.js")

// global person array
let persons = []

/**
 * Person cst
 */
exports.Person = function Person(id, firstname, lastname, books) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.books = books;

    this.toString = function() {
        return this.id + ", " + this.firstname + ", " + this.lastname + ", " + this.books;
    }
};

/**
 * Init a Person object array
 *
 * @param data to construct Person object
 */
exports.loadPersons = function () {
    if (fs.existsSync('data/persons.json')) {
        persons = JSON.parse(fs.readFileSync("data/persons.json"));
    }
    return persons;
};

/**
 * Save a Person object array
 */
exports.savePersons = function () {
    fs.writeFileSync("data/persons.json", JSON.stringify(persons));
    return persons;
};

/**
 * Get all Persons objects
 */
exports.getPersons = async function (callback) {
    callback(null,await router.getPersonMongo().find({}).sort('id'));
};

exports.getOnePerson = async function(id, callback) {
    let status = 200
    let person = await router.getPersonMongo().findOne({id: id})
    if(!person) {
        status = 404
    }
    callback(status,person)
}
