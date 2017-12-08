'use strict';
const test = require('tape');
const fs = require('fs');

function solve(input) {

  const list = input.split(/\s/);

  let counter = 0;
  let index = 0;
  //print();
  while (index >= 0 && index < list.length) {
    counter++;
    let jumpVal = parseInt(list[index]);
    const startIndex = index;
    index += jumpVal;
    if (jumpVal >= 3) {
      list[startIndex]--;
    } else {
      list[startIndex]++;
    }

    //print();
    //console.log(` index: ${index}`);
  }
  return counter;

  function print() {
    let str = '';
    for (let i = 0; i < list.length; i++) {
      if (index === i) {
        str += `(${list[i]}) `;
      } else {
        str += list[i] + ' ';
      }
    }
    console.log(str);
  }
}

const runTest = function (input, expected) {
  test(`solve`, assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

const example = `0
3
0
1
-3`;
runTest(example, 10);


const puzzleInput = fs.readFileSync('./day05.txt', {
  encoding: 'utf8'
});

console.log('answer', solve(puzzleInput));