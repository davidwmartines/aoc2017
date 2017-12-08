'use strict';
const test = require('tape');
const fs = require('fs');

function parse(str) {
  const arr = [];
  const rows = str.split('\n');
  rows.forEach(row => {
    const vals = row.split(/\s/);
    arr.push(vals.map(v => parseInt(v)));
  });
  return arr;
}

function solve(input) {
  let total = 0;
  input.forEach(row => {
    row.sort((a, b) => {
      return a - b;
    });
    const rowTotal = row[row.length - 1] - row[0];
    //console.log(rowTotal);
    total += rowTotal;
    //console.log(total);
  });
  return total;
}

const example =
  `5 1 9 5
7 5 3
2 4 6 8`;

const runTest = function (input, expected) {

  const parsed = parse(input);

  test('parse', assert => {

    assert.deepEquals(parsed, [
      [5, 1, 9, 5],
      [7, 5, 3],
      [2, 4, 6, 8]
    ], 'parse failed');
    assert.end();
  });

  test(`solve`, assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(parsed);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

//runTest(example, 18);


const puzzleInput = fs.readFileSync('./day02.txt', {
  encoding: 'utf8'
});
const parsedPuzzle = parse(puzzleInput);
console.log('answer', solve(parsedPuzzle));