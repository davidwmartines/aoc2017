'use strict';
const test = require('tape');
const fs = require('fs');
const _ = require('lodash');

function solve(input){

  const phrases = input.split(/\n/g);
  console.log('phrases', phrases.length);
  return _.compact(phrases).filter(isValid).length;

}

const testIsValid = function(input, expected){
  test(`isValid`, assert => {
    const msg = `isValid with ${input} should return ${expected}`;
    const value = isValid(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

const testValidCount = function(input, expected){
  test('solve', assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

function isValid(passphrase){
  const words = passphrase.split(' ');
  return _.uniq(words).length === words.length;
}


testIsValid('aa bb cc dd ee', true);
testIsValid('aa bb cc dd aa', false);
testIsValid('aa bb cc dd aaa', true);

const sample = `
aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa
`;

testValidCount(sample, 2);


const puzzleInput = fs.readFileSync('./day04.txt', {
  encoding: 'utf8'
});



console.log('answer', solve(puzzleInput));