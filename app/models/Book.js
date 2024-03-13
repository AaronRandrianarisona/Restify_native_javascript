

let fs = require('fs'),
    PersonModel = require(process.cwd() + "/app/models/Person.js"),
    router = require(process.cwd() + "/app/core/router.js")
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
exports.getBooks = async function (callback) {
    callback(null, await router.getBookMongo().find({}));
};

/**
 * Get one Book object
 */
exports.getOneBook = async function (isbn, callback) {
    let status = 200
    const book = await router.getBookMongo().findOne({ isbn: isbn })
    if (!book) {
        status = 404
    }
    callback(status, book)
};

exports.postBook = async function (book, callback) {
    let status = 201 //Created
    let createdBook = {}
    const found_book = await router.getBookMongo().findOne({ isbn: book.isbn })
    if (found_book) {
        status = 409 //Conflict
    } else {
        createdBook = await router.getBookMongo().create(book)
        console.log("found book", found_book, createdBook)

    }
    callback(status, createdBook)
}

exports.deleteBook = async function (isbn, callback) {
    let status = 200
    let deletedBook = await router.getBookMongo().findOneAndDelete({ isbn: isbn })
    if (!deletedBook) {
        status = 404
    }
    callback(status, deletedBook)
}

exports.putBook = async function (isbn, properties, callback) {
    let status = 200
    let book = await router.getBookMongo().findOneAndUpdate({ isbn: isbn }, properties)
    if (!book) {
        status = 404
    }
    const updatedBook = await router.getBookMongo().findOne({ isbn: isbn })
    callback(status, updatedBook)
}

exports.getAuthors = async function (isbn, callback) {
    let status = 200
    let authors = []
    let book = await router.getBookMongo().findOne({ isbn: isbn })
    if (!book) {
        status = 404
    } else {
        authors = book.authors
    }
    callback(status, authors)
}

exports.getAuthorsV2 = async function (isbn, callback) {
    let status = 200
    let authors = []
    let book = await router.getBookMongo().findOne({ isbn: isbn })
    if (!book) {
        status = 404
    } else {
        
        for (const i in book.authors) {
            let a = await router.getPersonMongo().findOne({ id: book.authors[i].id })
            console.log("truc",a,i,book.authors)
            authors.push(a)
        }
        console.log(authors)
    }
    callback(status, authors)
}