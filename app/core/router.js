let restify = require('restify'),
    errs = require('restify-errors'),
    fs = require('fs');

// To activate controllers
let controllers = {}
    , controllers_path = process.cwd() + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
});

// helper function
exports.getServer = function() {
    return server;
};

// server creation
var server = restify.createServer();

// server configuration
server.use(restify.plugins.bodyParser());  // needed for body request parsing
server.use(restify.plugins.queryParser()); // needed for query parameter request parsing

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
server.get({name: "person",path: "/api/persons/:id"},controllers.PersonController.getPerson)
/**Post configuration */
////-------Configuration Books----------/////
server.post("/api/books",controllers.BookController.postBook)

/**Delete configuration */
////-------Configuration Books---------/////
server.del("/api/books/:isbn",controllers.BookController.deleteBook)

/**Put configuration */
////-------Configuration Books---------/////
server.put("/api/books/:isbn",controllers.BookController.putBook)

var port = process.env.PORT || 3000;

server.listen(port, function (err) {
    if (err)
        console.error(err)
    else {
        // pseudo persistence : load data from JSON files
        controllers.BookController.initStorage();
        controllers.PersonController.initStorage();
        console.log('App is ready at : ' + port);
    }
});

/** function called just before server shutdown
process.on('SIGINT', function () {
    // pseudo persistence : backup current data into JSON files
    controllers.BookController.saveStorage();
    controllers.PersonController.saveStorage();
    process.exit(0);
});
*/