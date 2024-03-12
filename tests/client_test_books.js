let restify = require('restify-clients'),
    assert = require('chai').assert,
    async = require('async-seq');

let client = restify.createJsonClient({
    url: 'http://localhost:3000',
    version: '1.0.0'
});

async.seq(
    function (callback) {
        // retrieving all existing book resources
        client.get('/api/books', function (err, req, res, books) {
            assert.ifError(err);
            //console.log('get %j', books);
            assert.deepEqual(books, [{"isbn":"ZT56","title":"Essai","authors":[{"id":1},{"id":2}],"price":12.4},
                                     {"isbn":"ZT57","title":"Roman","authors":[{"id":1}],"price":8}], 'Pb get (test1)');
            callback(null, 'test1');
        })
    },
    /* uncomment the following tests */
    function (tst, callback) {
        // retrieving an specific book resource
        client.get('/api/books/ZT56', function (err, req, res, book) {
            assert.ifError(err);
            //console.log('get %j', book);
            assert.deepEqual(book, {isbn: "ZT56", title: "Essai",authors:[{id:1},{id:2}],price:12.4}, 'Pb get (test2)');
            callback(null, tst + ' ' + 'test2');
        })
    },
    function (tst, callback) {
        // creating a new resource
        client.post('/api/books', {isbn: "ZT58", title: "Nouvelle", authors:[{id:2}],price:15}, function (err, req, res, book) {
            assert.ifError(err);
            //console.log('post %j', book);
            assert.deepEqual(book, {isbn: "ZT58", title: "Nouvelle", authors:[{id:2}],price:15}, 'Pb post (test3)')
            callback(null, tst + ' ' + 'test3');
        })
    },
    function (tst, callback) {
        // same resource created twice : a restify ConflictError error must be return
        client.post('/api/books', {isbn: "ZT58", title: "Nouvelle", authors:[{id:2}],price:15}, function (err, req, res, book) {
            //console.log('post %j', res.statusCode);
            assert.strictEqual(res.statusCode, 409, "Pb post ZT58 (test4)");
            callback(null, tst + ' ' + 'test4');
        })
    },
    function (tst, callback) {
        // retrieving a newly created resource
        client.get('/api/books/ZT58', function (err, req, res, book) {
            assert.ifError(err);
            //console.log('get %j', book);
            assert.deepEqual(book, {isbn: "ZT58", title: "Nouvelle", authors:[{id:2}],price:15}, 'Pb get (test5)')
            callback(null, tst + ' ' + 'test5');
        })
    },
    function (tst, callback) {
        // delete book ZT58
        client.del('/api/books/ZT58', function (err, req, res, book) {
            assert.ifError(err);
            //console.log('del %j', book);
            assert.deepEqual(book, {isbn: "ZT58", title: "Nouvelle", authors:[{id:2}],price:15}, 'Pb del (test6)');
            callback(null, tst + ' ' + 'test6');
        })
    },
    function (tst, callback) {
        // the book is deleted so get request must fail
        client.get('/api/books/ZT58', function (err, req, res, book) {
            //console.log('post %j', res.statusCode);
            assert.strictEqual(res.statusCode,404,"Pb get ZT58 (test7)");
            callback(null, tst + ' ' + 'test7');
        })
    },
    function (tst, callback) {
        // updating book ZT56
        client.put('/api/books/ZT56', {"title": "Roman"}, function (err, req, res, updatedBook) {
            assert.ifError(err);
            //console.log('put %j', updatedBook);
            assert.deepEqual(updatedBook, {isbn: "ZT56", title: "Roman",authors:[{id:1},{id:2}],price:12.4}, 'Pb put (test8)');
            callback(null, tst + ' ' + 'test8');
        })
    },
        function (tst, callback) {
        // restore previous state of book ZT56
        client.put('/api/books/ZT56', {"title": "Essai"}, function (err, req, res, updatedBook) {
            assert.ifError(err);
            //console.log('put %j', updatedBook);
            assert.deepEqual(updatedBook, {isbn: "ZT56", title: "Essai",authors:[{id:1},{id:2}],price:12.4}, 'Pb put (test9)');
            callback(null, tst + ' ' + 'test9');
        })
    },
    function (tst, callback) {
        // retrieving all existing book resources
        client.get('/api/books', function (err, req, res, books) {
            assert.ifError(err);
            //console.log('get %j', books);
            assert.deepEqual(books, [{"isbn":"ZT56","title":"Essai","authors":[{"id":1},{"id":2}],"price":12.4},
                {"isbn":"ZT57","title":"Roman","authors":[{"id":1}],"price":8}], 'Pb get (test10)');
            callback(null, tst + ' ' + 'test10');
        })
    },//*/

)(function (err, results) {
    console.log('Tests %j OK...', results);
});
