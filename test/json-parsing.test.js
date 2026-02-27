var expect = require('chai').expect;
var SocketAdapter = require('../src/core/SocketAdapter');

describe('JSON Parsing Error Handling', function() {

  describe('SocketAdapter', function() {

    it('should emit an error event when receiving invalid JSON as a string', function(done) {
      var client = {
        transportOptions: {},
        emit: function(event, data) {
          if (event === 'error') {
            expect(data).to.be.a('string');
            expect(data).to.contain('Failed to parse JSON rosbridge message');
            done();
          }
        }
      };

      var adapter = SocketAdapter(client);
      adapter.onmessage('not valid json {{{');
    });

    it('should emit an error event when JSON contains NaN', function(done) {
      var client = {
        transportOptions: {},
        emit: function(event, data) {
          if (event === 'error') {
            expect(data).to.be.a('string');
            expect(data).to.contain('Failed to parse JSON rosbridge message');
            done();
          }
        }
      };

      var adapter = SocketAdapter(client);
      adapter.onmessage('{"value": NaN}');
    });

    it('should emit an error event when data.data contains invalid JSON', function(done) {
      var client = {
        transportOptions: {},
        emit: function(event, data) {
          if (event === 'error') {
            expect(data).to.be.a('string');
            expect(data).to.contain('Failed to parse JSON rosbridge message');
            done();
          }
        }
      };

      var adapter = SocketAdapter(client);
      adapter.onmessage({ data: '[1, NaN, 3]' });
    });

    it('should still handle valid JSON messages', function(done) {
      var client = {
        transportOptions: {},
        emit: function(topic, msg) {
          expect(topic).to.equal('/test_topic');
          expect(msg.data).to.equal(42);
          done();
        }
      };

      var adapter = SocketAdapter(client);
      adapter.onmessage({ data: '{"op":"publish","topic":"/test_topic","msg":{"data":42}}' });
    });

    it('should handle valid JSON string messages', function(done) {
      var client = {
        transportOptions: {},
        emit: function(topic, msg) {
          expect(topic).to.equal('/test_topic');
          expect(msg.data).to.equal('hello');
          done();
        }
      };

      var adapter = SocketAdapter(client);
      adapter.onmessage('{"op":"publish","topic":"/test_topic","msg":{"data":"hello"}}');
    });

    it('should not throw when receiving invalid JSON', function() {
      var errorEmitted = false;
      var client = {
        transportOptions: {},
        emit: function(event) {
          if (event === 'error') {
            errorEmitted = true;
          }
        }
      };

      var adapter = SocketAdapter(client);
      expect(function() {
        adapter.onmessage('{"values": [0.11920929, NaN, 0.479]}');
      }).to.not.throw();
      expect(errorEmitted).to.be.true;
    });
  });
});
