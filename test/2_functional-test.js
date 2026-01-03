// tests/2_functional-tests-simple.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(10000);
  
  let server = null;
  
  suiteSetup(function(done) {
    // Start the Next.js server for testing
    const { createServer } = require('http');
    const { parse } = require('url');
    const next = require('next');
    
    const dev = process.env.NODE_ENV !== 'production';
    const app = next({ dev });
    const handle = app.getRequestHandler();
    
    app.prepare().then(() => {
      server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      });
      
      server.listen(3001, (err) => {
        if (err) throw err;
        console.log('> Test server ready on http://localhost:3001');
        done();
      });
    });
  });
  
  suiteTeardown(function(done) {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });
  
  suite('API Integration Tests', function() {
    
    test('Convert 10L (valid input)', function(done) {
      chai.request('http://localhost:3001')
        .get('/api/convert')
        .query({ input: '10L' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'initNum');
          assert.property(res.body, 'initUnit');
          assert.property(res.body, 'returnNum');
          assert.property(res.body, 'returnUnit');
          assert.property(res.body, 'string');
          assert.equal(res.body.initNum, 10);
          assert.equal(res.body.initUnit, 'L');
          assert.approximately(res.body.returnNum, 2.64172, 0.00001);
          assert.equal(res.body.returnUnit, 'gal');
          assert.include(res.body.string, '10 liters converts to');
          done();
        });
    });
    
    test('Convert 32g (invalid unit)', function(done) {
      chai.request('http://localhost:3001')
        .get('/api/convert')
        .query({ input: '32g' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'invalid unit');
          done();
        });
    });
    
    test('Convert 3/7.2/4kg (invalid number)', function(done) {
      chai.request('http://localhost:3001')
        .get('/api/convert')
        .query({ input: '3/7.2/4kg' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'invalid number');
          done();
        });
    });
    
    test('Convert 3/7.2/4kilomegagram (invalid number and unit)', function(done) {
      chai.request('http://localhost:3001')
        .get('/api/convert')
        .query({ input: '3/7.2/4kilomegagram' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'invalid number and unit');
          done();
        });
    });
    
    test('Convert kg (no number)', function(done) {
      chai.request('http://localhost:3001')
        .get('/api/convert')
        .query({ input: 'kg' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'initNum');
          assert.property(res.body, 'initUnit');
          assert.property(res.body, 'returnNum');
          assert.property(res.body, 'returnUnit');
          assert.property(res.body, 'string');
          assert.equal(res.body.initNum, 1);
          assert.equal(res.body.initUnit, 'kg');
          assert.approximately(res.body.returnNum, 2.20462, 0.00001);
          assert.equal(res.body.returnUnit, 'lbs');
          assert.include(res.body.string, '1 kilogram converts to');
          done();
        });
    });
  });
});