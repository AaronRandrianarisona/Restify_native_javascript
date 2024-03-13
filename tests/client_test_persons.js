let restify = require('restify-clients'),
    assert = require('chai').assert,
    async = require('async-seq');

let client = restify.createJsonClient({
    url: 'http://localhost:3000',
    version: '1.0.0'
});

async.seq(
    function (callback) {
        // retrieving all person resources
        client.get('/api/persons', function (err, req, res, persons) {
            assert.ifError(err);
            //console.log('get %j', persons);
            assert.deepEqual(persons, [{id:1,firstname:"Pierre",lastname:"Durand",books:[{isbn:"ZT56"},{isbn:"ZT57"}],"_id":persons[0]._id,"__v":persons[0].__v},
                                       {id:2,firstname:"Paul",lastname:"Martin",books:[{isbn:"ZT56"}],"_id":persons[1]._id,"__v":persons[1].__v}], 'Pb get (test1)');
            callback(null, 'test1');
        })
    },
    function (tst, callback) {
        // retrieving the person resource 1
        client.get('/api/persons/1', function (err, req, res, person) {
            assert.ifError(err);
            //console.log('get %j', person);
            assert.deepEqual(person, {id:1,firstname:"Pierre",lastname:"Durand",books:[{isbn:"ZT56"},{isbn:"ZT57"}],"_id":person._id,"__v":person.__v}, 'Pb get (test2)');
            callback(null, tst + ' ' + 'test2');
        })
    },
    function (tst, callback) {
        // trying to retrieve an unknown person
        client.get('/api/persons/3', function (err, req, res, person) {
            //console.log('get %j', person);
            assert.strictEqual(res.statusCode,404,"Pb get unknown person (test3)");
            callback(null, tst + ' ' + 'test3');
        })
    },
    function (tst, callback) {
        // retrieving all authors of book ZT56
        client.get('/api/books/ZT56/authors', function (err, req, res, authors) {
            assert.ifError(err);
            //console.log('get %j', authors);
            assert.deepEqual(authors, [{id:1},{id:2}], 'Pb get (test4)');
            callback(null, tst + ' ' + 'test4');
        })
    },
)(function (err, results) {
    console.log('Tests %j OK...', results);
});
