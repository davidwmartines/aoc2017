'use strict';
const test = require('tape');
const fs = require('fs');

function solve(input){

}

const runTest = function(input, expected){
  test(`solve`, assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

runTest('1212', 6);


const puzzleInput = fs.readFileSync('./day01.txt', {
  encoding: 'utf8'
});

console.log('answer', solve(puzzleInput));