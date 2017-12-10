'use strict';
const test = require('tape');
const fs = require('fs');

function solve(input){

}

function runTests(){
  const runTest = function(input, expected){
    test(`solve`, assert => {
      const msg = `solve with ${input} should return ${expected}`;
      const value = solve(input);
      assert.equal(value, expected, msg);
      assert.end();
    });
  }
  
  runTest('1212', 6);
}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day0.txt', {
    encoding: 'utf8'
  });

  console.log('* * ANSWER * *');
  console.log(solve(puzzleInput));
  console.log('* * * * * * * *');
}


runTests();
//solvePuzzle();