const test = require('tape');
const fs = require('fs');

function captchaSolver(input) {

  const half = input.length / 2;
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    const digit = parseInt(input[i]);

    let nextIndex;
    if (i + half > input.length - 1) {
      nextIndex = half - (input.length - i);
    } else {
      nextIndex = i + half;
    }

    const next = parseInt(input[nextIndex]);

    if (digit === next) {
      total += digit;
    }

  }

  return total;
}

const runTest = function(input, expected){
  test(`captchaSolver()`, assert => {
    const msg = `captchaSolver() with ${input} should return ${expected}`;
  
    const value = captchaSolver(input);
  
    assert.equal(value, expected, msg);
    assert.end();
  });
}

// runTest('1212', 6);
// runTest('1221', 0);
// runTest('123425', 4);
// runTest('123123', 12);
// runTest('12131415', 4);


const puzzleInput = fs.readFileSync('./day01.txt', {
  encoding: 'utf8'
});

console.log('answer', captchaSolver(puzzleInput));