;
(function() {
  'use strict';


  function FiniteStateMachine() {
    this.current = 'none';
    this.startState = 'none';
    this.finalState = 'none';
    this.map = {};
  }


  var Prototype = FiniteStateMachine.prototype;


  Prototype.add = function(t) {
    var name = t.name;
    this.map[name] = this.map[name] || {};
    this.map[name][t.from] = t.to || t.from; // no-op transition if no 'to'
    this[name] = this.attachEvent(name, this.map[name]);
  }


  Prototype.is = function(state) {
    return this.current === state;
  }


  Prototype.can = function(event) {
    return this.map[event].hasOwnProperty(this.current);
  }


  Prototype.cannot = function(event) {
    return !this.can(event);
  }


  Prototype.attachEvent = function(event, map) {
    return function() {
      if (this.cannot(event)) {
        throw new Error('Invalid transition');
      }
      var to = map[this.current];
      this.current = to;
    };
  }

  /**
   * Creates a new fsm.
   * @return fsm
   */
  FiniteStateMachine.create = function(opts) {
    var initial = opts.start,
        finalState   = opts.final,
        transitions = opts.transitions;
    var fsm = new FiniteStateMachine();
    if (initial && typeof initial === 'string') {
      initial = {state: initial, event: 'startup'}
      fsm.add({name: initial.event, from: 'none', to: initial.state})
    }
    for (var i = 0; i < transitions.length; i++) {
      fsm.add(transitions[i]);
    }
    fsm.startState = opts.start;
    fsm.finalState = opts.final;
    if (initial) {
      fsm[initial.event]();
    }
    debugger;
    return fsm;
  };

  module.exports = {
    create: FiniteStateMachine.create
  };
}());
