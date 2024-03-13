let fs = require('fs'),
    BookModel = require(process.cwd() + "/app/models/Book.js"),
    PersonModel = require(process.cwd() + "/app/models/Person.js"),
    errs = require("restify-errors");

/**
 * Init book set.
 */

exports.initStorage = async function (PersonMongo) {
    let persons = PersonModel.loadPersons();
    persons.forEach(async (person) => {
        await PersonMongo.create({ ...person, books: []})
        .then(docPerson => {
            console.log("\n>> Created Person:\n", docPerson);
            return docPerson;
        })
    });
    console.log("Persons loaded: %j", persons);
    return persons
};

/**
 * Save book set
 */

exports.saveStorage = function () {
    var data = BookModel.saveBooks();
    console.log("Data saved: %j", data);
};


/**
 * Returns the specified person (if exists) or all persons if isbn is not provided.
 */
exports.getPerson = function (req, res, next) {
    if (req.params.id) {
        console.log("getPerson isbn = %j", req.params.id);
        PersonModel.getOnePerson(req.params.id, function (status, person) {
            res.json(status, person)
            return person
        })

    } else {
        PersonModel.getPersons(function (err, persons) {
            if (err) {
                return next(err);
            } else {
                res.json(200, persons);
                return next();
            }
        })
    }
}
