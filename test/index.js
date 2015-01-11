var should = require('chai').should(),
    fsm = require('../index');


function statemachine(start, final) {
  var opts = {
    transitions: [
      {name: 'start', from: 'draft', to: 'started'},
      {name: 'finish', from: 'started', to: 'finished'},
      {name: 'accept', from: 'finished', to: 'accepted'},
      {name: 'reject', from: 'finished', to: 'rejected'},
      // on cancel
      {name: 'cancel', from: 'finished', to: 'draft'},
      // on restart
      {name: 'restart', from: 'rejected', to: 'start'}
    ]
  };
  if (!!start) {
    opts.start = start;
  }
  return fsm.create(opts);
}


describe('FiniteStateMachine', function() {
  describe('on startup', function() {
    describe('#current', function() {
      it('should defaults to "none"', function() {
        var fsm = statemachine();
        fsm.current.should.equal('none');
      });

      it('should set correct initial state', function() {
        var fsm = statemachine('draft', 'accept');
        fsm.current.should.equal('draft');
      });

      it('should return the active state', function() {
        var fsm = statemachine('draft', 'accept');
        fsm.start();
        fsm.current.should.equal('started');
      });
    });

    describe('#isFinished()', function() {
      it('should return true when in final state', function() {
        var fsm = statemachine('draft', 'accept');
        fsm.start();
        fsm.finish();
        fsm.accept();
        fsm.current.should.equal('accepted');
      });
    });
  });
});
