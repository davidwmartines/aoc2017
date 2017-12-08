'use strict';
const test = require('tape');
const fs = require('fs');
const util = require('util');
const _ = require('lodash');

class Instruction {
  constructor(string) {
    const parts = string.split(/\s/);
    this.target = parts[0];
    this.operation = parts[1];
    this.amount = parseInt(parts[2]);
    this.condLeft = parts[4];
    this.condOperator = parts[5];
    this.condRight = parseInt(parts[6]);
  }

  run(cpu) {
    const leftVal = cpu[this.condLeft] || 0;
    const exp = `if (${leftVal} ${this.condOperator} ${this.condRight}) cpu.${this.target} = ${cpu[this.target] || 0} ${this.operation === 'inc' ? '+': '-'} ${this.amount};`
    console.log(exp);
    eval(exp);
  }

}

function getLargestRegisterVal(cpu) {
  return _.values(cpu).sort((a, b) => b - a)[0];
}

function parseInput(input) {
  const lines = input.split('\n');
  return lines.map(l => new Instruction(l));
}

function solve(input) {
  const instructions = parseInput(input);
  const cpu = {};
  instructions.forEach(i => i.run(cpu));
  const largestRegister = getLargestRegisterVal(cpu);
  return largestRegister;
}

function runTests() {

  const example = `b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`;

  const testInstructionCtor = function (string, expected) {
    test(`Instruction.constructor`, assert => {
      const msg = `solve with ${string} should return ${util.inspect(expected)}`;
      const value = new Instruction(string);
      assert.deepEqual(value, expected, msg);
      assert.end();
    });
  };


  const testRun = function (instruction, cpu, endState) {
    test(`Instruction.run`, assert => {
      const msg = `Instruction.run with ${util.inspect(instruction)} should return endState`;
      instruction.run(cpu);
      assert.deepEqual(cpu, endState, msg);
      assert.end();
    });
  }

  testInstructionCtor('b inc 5 if a > 1', {
    target: 'b',
    operation: 'inc',
    amount: 5,
    condLeft: 'a',
    condOperator: '>',
    condRight: 1
  });

  testInstructionCtor('c dec -20 if c == 10', {
    target: 'c',
    operation: 'dec',
    amount: -20,
    condLeft: 'c',
    condOperator: '==',
    condRight: 10
  });

  testRun(new Instruction('b inc 5 if a > 1'), {}, {});

  testRun(new Instruction('b inc 5 if a > 1'), {
    a: 0
  }, {
    a: 0
  });

  testRun(new Instruction('a inc 1 if b < 5'), {
    a: 0
  }, {
    a: 1
  });

  testRun(new Instruction('c dec -10 if a >= 1'), {
    a: 1,
    b: 0
  }, {
    a: 1,
    b: 0,
    c: 10
  });

  testRun(new Instruction('c inc -20 if c == 10'), {
    a: 1,
    b: 0,
    c: 10
  }, {
    a: 1,
    b: 0,
    c: -10
  });

  test(`getLargestRegisterVal`, assert => {

    const cpu = {
      b: 0,
      a: 1,
      c: -10
    };
    const largest = getLargestRegisterVal(cpu);
    assert.equal(largest, 1, 'largest register val should be 1');
    assert.end();
  });

  test(`parse`, assert => {

    const val = parseInput(example);
    assert.equal(val.length, 4, 'parse should create 4 instructions');

    assert.deepEqual(val[0], {
      target: 'b',
      operation: 'inc',
      amount: 5,
      condLeft: 'a',
      condOperator: '>',
      condRight: 1
    }, 'first parsed instruction');

    assert.deepEqual(val[3], {
      target: 'c',
      operation: 'inc',
      amount: -20,
      condLeft: 'c',
      condOperator: '==',
      condRight: 10
    }, 'fourth parsed instruction');

    assert.end();
  });

  test(`solve`, assert => {
    const val = solve(example);
    assert.equal(val, 1, 'Solution should be 1');
    assert.end();
  })

}


//runTests();

const puzzleInput = fs.readFileSync('./day08.txt', {
  encoding: 'utf8'
});

const answer = solve(puzzleInput);
console.log('* * ANSWER * *');
console.log(answer);
console.log('* * * * * * * *');