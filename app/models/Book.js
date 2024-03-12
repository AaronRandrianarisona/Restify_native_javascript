let fs = require('fs'),
    PersonModel = require(process.cwd() + "/app/models/Person.js");

// global book array
let books = []

/**
 * Book cst
 */
exports.Book = function Book(isbn, title, authors, price) {
    this.isbn = isbn;
    this.title = title;
    this.authors = authors;
    this.price = price;

    this.toString = function () {
        return this.isbn + ", " + this.title + ", " + this.authors + ", " + this.price;
    }
};

/**
 * Init a Book object array
 *
 * @param data data to construct Book object
 */
exports.loadBooks = function () {
    if (fs.existsSync('data/books.json')) {
        books = JSON.parse(fs.readFileSync("data/books.json"));
    }
    return books;
};

/**
 * Save a Book object array
 */
exports.saveBooks = function () {
    fs.writeFileSync("data/books.json", JSON.stringify(books));
    return books;
};

/**
 * Get all Book objects
 */
exports.getBooks = function (callback) {
    callback(null, books);
};

/**
 * Get one Book object
 */
exports.getOneBook = function (isbn, callback) {
    let status = 200
    const book = books.filter((book) => book.isbn === isbn)[0]
    if (!book) {
        status = 404
    }
    callback(status, book)
};

exports.postBook = function (book, callback) {
    let status = 201 //Created
    let found = false
    books.forEach((b) => { //TODO: utiliser une autre methode , ou une boucle for simple pour gagner en performance
        if (b.isbn === book.isbn) {
            found = true
        }
    })
    if (found) {
        status = 409 //Conflict
    } else {
        books.push(book)
    }
    callback(status, book)
}

exports.deleteBook = function (isbn, callback) {
    let status = 200
    let deletedBook = {}
    let found = false
    books.forEach((b, index) => {
        if (b.isbn === isbn) {
            deletedBook = b
            books.splice(index, 1)
            found = true
        }
    })
    if (!found) {
        status = 404
    }

    callback(status, deletedBook)
}

exports.putBook = function (isbn, properties, callback) {
    let status = 200
    let found = false
    let updatedBook = {}
    books.forEach((b, index) => {
        if (b.isbn === isbn) {
            books[index] = { ...books[index], ...properties } //Ajoute aussi des attributs si elle n'existait pas grace aux dépaquetage
            updatedBook = books[index]
            found = true
        }
    })
    if (!found) {
        status = 404
    }
    callback(status, updatedBook)
}

exports.getAuthors = function (isbn, callback) {
    let status = 200
    let authors = []
    let book = books.filter((b) => b.isbn == isbn)[0]
    if (!book) {
        status = 404
    } else {
        authors = book.authors
    }
    callback(status, authors)
}

exports.getAuthorsV2 = function (isbn, callback) {
    let status = 200
    let authors = []
    let book = books.filter((b) => b.isbn == isbn)[0]
    if (!book) {
        status = 404
    } else {
        authors = book.authors.map((author) => {
            let pers = {}
            PersonModel.getOnePerson(author.id, function (status, person) {
                pers = person
            })
            return pers
        })
    }
    callback(status, authors)
}