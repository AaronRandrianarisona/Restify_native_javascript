let restify = require('restify'),
    errs = require('restify-errors'),
    fs = require('fs'),
    mongoose = require("mongoose")

// To activate controllers
let controllers = {}
    , controllers_path = process.cwd() + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
});

// helper function
exports.getServer = function () {
    return server;
};

// server creation
var server = restify.createServer();

// server configuration
server.use(restify.plugins.bodyParser());  // needed for body request parsing
server.use(restify.plugins.queryParser()); // needed for query parameter request parsing

//mongoDB Schema-model
const bookSchema = new mongoose.Schema({
    isbn: String,
    title: String,
    authors: [
        // {id: Number}
        { type: Object, ref: 'Person' }
    ],
    price: Number
})
const Book = mongoose.model('Book', bookSchema)

const personSchema = new mongoose.Schema({
    id: Number,
    firstname: String,
    lastname: String,
    books: [
        // { isbn: String }
        { type: Object, ref: 'Book' }
    ]
})
const Person = mongoose.model('Person', personSchema)

//--gestion relation many-to-many ----------//
const createBook = function (book) {
    return Book.create(book).then(docBook => {
        console.log("\n>> Created Book:\n", docBook);
        return docBook;
    })
}

const createPerson = function (person) {
    return Person.create(person).then(docPerson => {
        console.log("\n>> Created Person:\n", docPerson);
        return docPerson;
    })
}

const addPersonToBook = function (bookId, person) {
    return Book.findByIdAndUpdate(
        bookId,
        { $push: { authors: person.id } },
        { new: true, useFindAndModify: false }
    );
};

const addBookToPerson = function (personId, book) {
    return Person.findByIdAndUpdate(
        personId,
        { $push: { books: book._id } },
        { new: true, useFindAndModify: false }
    );
};
// route configuration
/**Get configuration */
////-------Configuration Books----------/////
server.get("/api/books", controllers.BookController.getBook);
// server.get("/api/books/:isbn",controllers.BookController.getBook)
server.get("/api/books/:isbn", restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: controllers.BookController.getBook },
    { version: '2.0.0', handler: controllers.BookController.getBookV2 }
]));

// server.get("/api/books/:isbn/authors",controllers.BookController.getAuthors)
server.get("/api/books/:isbn/authors", restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: controllers.BookController.getAuthors },
    { version: '2.0.0', handler: controllers.BookController.getAuthorsV2 }
]));
////-------Configuration Persons--------/////
server.get("/api/persons", controllers.PersonController.getPerson)
server.get({ name: "person", path: "/api/persons/:id" }, controllers.PersonController.getPerson)
/**Post configuration */
////-------Configuration Books----------/////
server.post("/api/books", controllers.BookController.postBook)

/**Delete configuration */
////-------Configuration Books---------/////
server.del("/api/books/:isbn", controllers.BookController.deleteBook)

/**Put configuration */
////-------Configuration Books---------/////
server.put("/api/books/:isbn", controllers.BookController.putBook)

var port = process.env.PORT || 3000;

server.listen(port, async function (err) {
    if (err)
        console.error(err)
    else {
        // pseudo persistence : load data from JSON file

        await mongoose.connect('mongodb://localhost:27017/books').then(async () => {
            await controllers.BookController.initStorage(Book);
            await controllers.PersonController.initStorage(Person);
        })

        console.log('App is ready at : ' + port);
    }
});

/** function called just before server shutdown */
process.on('SIGINT', function () {
    // pseudo persistence : backup current data into JSON files
    controllers.BookController.saveStorage();
    controllers.PersonController.saveStorage();
    mongoose.connection.db.dropDatabase()
    process.exit(0);
});