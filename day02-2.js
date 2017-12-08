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
    for (let i = 0; i < row.length; i++) {
      const tester = row[i];
      console.log('tester', tester);
      const others = row.filter((e, ei) => {
        return ei !== i;
      });
      others.forEach(o => {
        console.log('other', o);
        const val = tester / o;
        //console.log('val', val);
        if (Number.isInteger(val)) {
          console.log('summing', val);
          total += val;
        }
      });
    }
  });
  return total;
}

const example =
`5 9 2 8
9 4 7 3
3 8 6 5`;

const runTest = function (input, expected) {

  const parsed = parse(input);

  test(`solve`, assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(parsed);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

//runTest(example, 9);


const puzzleInput = fs.readFileSync('./day02.txt', {
  encoding: 'utf8'
});
const parsedPuzzle = parse(puzzleInput);
console.log('answer', solve(parsedPuzzle));