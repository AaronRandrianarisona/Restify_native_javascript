let restify = require('restify-clients'),
    assert = require('chai').assert,
    async = require('async-seq');

let clientV2 = restify.createJsonClient({
    url: 'http://localhost:3000',
    version: '~2'
});

async.seq(
    function (callback) {
        // test for HAL
        clientV2.get('/api/books/ZT56', function (err, req, res, book) {
            assert.ifError(err);
            console.log('get %j', book);
            clientV2.get(book.authors[0].authorLink, function (err, req, res, author) {
                assert.deepEqual(author, {id:1,firstname:"Pierre",lastname:"Durand",books:[{isbn:"ZT56"},{isbn:"ZT57"}]}, 'Pb get (test1a)');
                //callback(null, 'test11');
                clientV2.get(book.authors[1].authorLink, function (err, req, res, author) {
                    assert.deepEqual(author, {id:2,firstname:"Paul",lastname:"Martin",books:[{isbn:"ZT56"}]}, 'Pb get (test1b)');
                    callback(null, 'test1');
                })
            })
        })
    },
    function (tst, callback) {
        // test for HAL
        clientV2.get('/api/books/ZT57', function (err, req, res, book) {
            assert.ifError(err);
            //console.log('get %j', book);
            clientV2.get(book.authors[0].authorLink, function (err, req, res, author) {
                assert.deepEqual(author, {id:1,firstname:"Pierre",lastname:"Durand",books:[{isbn:"ZT56"},{isbn:"ZT57"}]}, 'Pb get (test2)');
                callback(null, tst + ' ' + 'test2');
            })
        })
    },
)(function (err, results) {
    console.log('Tests %j OK...', results);
});
