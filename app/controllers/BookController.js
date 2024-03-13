let fs = require('fs'),
    BookModel = require(process.cwd() + "/app/models/Book.js"),
    PersonModel = require(process.cwd() + "/app/models/Person.js"),
    Server = require(process.cwd() + "/app/core/router.js"),
    errs = require("restify-errors");

/**
 * Init book set.
 */
exports.initStorage = async function (BookMongo) {
    let books = BookModel.loadBooks();
    books.forEach(async (book) => {
        await BookMongo.create({ ...book })
        .then(docBook => {
            console.log("\n>> Created Book:\n", docBook);
            return docBook;
        })
    })
    //
    console.log("Books loaded: %j", books);
};

/**
 * Save book set
 */
exports.saveStorage = function () {
    var data = BookModel.saveBooks();
    console.log("Data saved: %j", data);
}

/**
 * Returns the specified book (if exists) or all books if isbn is not provided.
 */
exports.getBook = function (req, res, next) {
    if (req.params.isbn) {
        console.log("getBook isbn = %j", req.params.isbn);
        BookModel.getOneBook(req.params.isbn, function (status, book) {
            res.json(status, book)
            return book
        })
    } else {
        BookModel.getBooks(function (err, books) {
            if (err) {
                return next(err);
            } else {
                res.json(200, books);
                return next();
            }
        })
    }
};

exports.getBookV2 = function (req, res, next) {
    if (req.params.isbn) {
        console.log("getBook isbn = %j", req.params.isbn);
        BookModel.getOneBook(req.params.isbn, function (status, book) {
            book.authors.forEach(author => { //Implementation HAL pour chaque auteurs
                author["authorLink"] = Server.getServer().router.render('person', {id: author.id})
            });
            res.json(status,book)
            return book
        })
    } else {
        BookModel.getBooks(function (err, books) {
            if (err) {
                return next(err);
            } else {
                res.json(200, books);
                return next();
            }
        })
    }
};

exports.postBook = function (req, res, next) {
    if (req.body.isbn) {
        BookModel.postBook(req.body, function (status, book) {
            switch (status) {
                case 409:
                    res.json(status, book)
                    return book
                case 201:
                    res.json(status, book)
                    BookModel.saveBooks()
                    return book
            }
        })
    } else {
        return next(null)
    }
}

exports.deleteBook = function (req, res, next) {
    if (req.params.isbn) {
        BookModel.deleteBook(req.params.isbn, function (status, book) {
            switch (status) {
                case 200:
                    res.json(status, book)
                    BookModel.saveBooks()
                    return book
                case 404:
                    res.json(status, book)
                    return book
            }
        })
    } else {
        return next(null)
    }
}

exports.putBook = function (req, res, next) {
    if (req.params.isbn) {
        BookModel.putBook(req.params.isbn, req.body, function (status, book) {
            switch (status) {
                case 200:
                    res.json(status, book)
                    BookModel.saveBooks()
                    return book
                case 404:
                    res.json(status, book)
                    return book
            }
        })
    }
}

exports.getAuthors = function (req, res, next) {
    if (req.params.isbn) {
        BookModel.getAuthors(req.params.isbn, function (status, authors) {
            switch (status) {
                case 200:
                    res.json(status, authors)
                    return authors
                case 404:
                    res.json(status, authors)
                    break
            }
        })
    }
}

exports.getAuthorsV2 = function (req, res, next) {
    if (req.params.isbn) {
        BookModel.getAuthorsV2(req.params.isbn, function (status, authors) {
            switch (status) {
                case 200:
                    res.json(status, authors)
                    return authors
                case 404:
                    res.json(status, authors)
                    break
            }
        })
    }
}
