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

    const largestRegister = getLargestRegisterVal(cpu);
    if ((cpu.max || 0) < largestRegister) {
      cpu.max = largestRegister;
    }
  }

}

function getLargestRegisterVal(cpu) {
  return _.values(cpu).sort((a, b) => b - a)[0];
}

function parseInput(input) {
  const lines = input.split('\n');
  return lines.map(l => new Instruction(l));
}

function solve(cpu, input) {
  const instructions = parseInput(input);
  instructions.forEach(i => i.run(cpu));
}

function runTests() {

  const example = `b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`;


  test(`solve`, assert => {
    const cpu = {};
    solve(cpu, example);
    assert.equal(cpu.max, 10, 'Max register ever was 10');
    assert.end();
  })

}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day08.txt', {
    encoding: 'utf8'
  });

  const cpu = {};
  solve(cpu, puzzleInput);
  console.log('* * ANSWER * *');
  console.log(cpu.max);
  console.log('* * * * * * * *');
}


//runTests();
solvePuzzle();