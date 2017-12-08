'use strict';
const test = require('tape');
const fs = require('fs');
const _ = require('lodash');

function solve(input) {
  const phrases = input.split(/\n/g);
  console.log('phrases', phrases.length);
  return _.compact(phrases).filter(isValid).length;
}

const testIsValid = function (input, expected) {
  test(`isValid`, assert => {
    const msg = `isValid with ${input} should return ${expected}`;
    const value = isValid(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

const testValidCount = function (input, expected) {
  test('solve', assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

function isValid(passphrase) {
  const words = passphrase.split(' ');
  let isValid = true;
  for (let i = 0; i < words.length; i++) {
    if (!isValid) {
      return isValid;
    }
    const tester = Array.from(words[i]).sort().join();
    //console.log('tester', tester);
    const others = words.filter((e, ei) => {
      return ei !== i;
    });
    others.forEach(o => {
      const other = Array.from(o).sort().join();
      //console.log(' other', other);
      if (other === tester) {
        //console.log('*************Anagram*************')
        isValid = false;
      }
    });
  }
  return isValid;
}

testIsValid('abcde fghij', true);
testIsValid('abcde xyz ecdab', false);
testIsValid('a ab abc abd abf abj', true);
testIsValid('iiii oiii ooii oooi oooo', true);
testIsValid('oiii ioii iioi iiio', false);

const sample = `
abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio'
`;

testValidCount(sample, 3);


const puzzleInput = fs.readFileSync('./day04.txt', {
  encoding: 'utf8'
});

console.log('answer', solve(puzzleInput));