'use strict';
const test = require('tape');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');

function solve(listLength, input) {

  const list = new Int32Array(listLength);
  for (let i = 0; i < listLength; i++) {
    list[i] = i;
  }
  console.log(`list: ${list}`);

  const lengths = input.split(',').map(c => parseInt(c));
  console.log(`lengths: ${lengths}`);

  let options = {
    array: list,
    position: 0,
    skip: 0
  };

  lengths.forEach(length => {
    options.length = length;
    options = knot(options);
    //console.log(`${util.inspect(options)}`);
  });

  console.log(`0: ${options.array[0]}, 1: ${options.array[1]}`);

  return options.array[0] * options.array[1];

}

function knot(options) {
  const result = Array.from(options.array);
  const arrayLength = options.array.length;

  /* extract section */
  const section = [];
  let position = options.position - 1;
  for (let p = 0; p < options.length; p++) {
    position++;
    position = position < arrayLength ? position : arrayLength - position
    const char = options.array[position];
    //console.log(`position: ${position}, char: ${char}`);
    section.push(char);
  }
  //console.log(`section: ${section}`);

  /* reverse */
  section.reverse();
  //console.log(`section: ${section}`);

  /* put back */
  position = options.position - 1;
  for (let p = 0; p < options.length; p++) {
    position++;
    position = position < arrayLength ? position : arrayLength - position;
    result[position] = section[p];
  }

  /* get next position */
  position = options.position - 1;
  for (let p = 0; p <= (options.length + options.skip); p++) {
    position++;
    position = position < arrayLength ? position : arrayLength - position;
    //console.log(`next pos: ${position}`);
  }

  return {
    array: result,
    position: position,
    skip: options.skip + 1
  };
}

function runTests() {

  const testKnot = function (options, expected) {
    test(`knot`, assert => {
      const msg = `knot with ${util.inspect(options)} should return ${util.inspect(expected)}`;
      const value = knot(options);
      assert.deepEqual(value, expected, msg);
      assert.end();
    });
  }

  testKnot({
    array: [0, 1, 2, 3, 4],
    position: 0,
    skip: 0,
    length: 3,
  }, {
    array: [2, 1, 0, 3, 4],
    position: 3,
    skip: 1
  });

  testKnot({
    array: [2, 1, 0, 3, 4],
    position: 3,
    skip: 1,
    length: 4
  }, {
    array: [4, 3, 0, 1, 2],
    position: 3,
    skip: 2
  });

  testKnot({
    array: [4, 3, 0, 1, 2],
    position: 3,
    skip: 2,
    length: 1
  }, {
    array: [4, 3, 0, 1, 2],
    position: 1,
    skip: 3
  });

  testKnot({
    array: [4, 3, 0, 1, 2],
    position: 1,
    skip: 3,
    length: 5
  }, {
    array: [3, 4, 2, 1, 0],
    position: 4,
    skip: 4
  });

  test(`solve`, assert => {
    const result = solve(5, '3,4,1,5');
    assert.equal(result, 12, 'solve should return 12');
    assert.end();
  });

}

function solvePuzzle() {

  const puzzleInput = '129,154,49,198,200,133,97,254,41,6,2,1,255,0,191,108';
  const answer = solve(256, puzzleInput);

  console.log('* * ANSWER * *');
  console.log(answer);
  console.log('* * * * * * * *');
}


//runTests();
solvePuzzle();