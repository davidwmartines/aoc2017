'use strict';
const test = require('tape');
const util = require('util');

function solve(listLength, input) {

  const list = new Int32Array(listLength);
  for (let i = 0; i < listLength; i++) {
    list[i] = i;
  }
  //console.log(`list: ${list}`);

  const lengths = makeLengthsList(input);

  let options = {
    array: list,
    position: 0,
    skip: 0
  };

  for (let round = 1; round <= 64; round++) {
    lengths.forEach(length => {
      options.length = length;
      options = knot(options);
      //console.log(`${util.inspect(options)}`);
    });
    //console.log(`completed round ${round}`);
  }

  //console.log(`final array length ${options.array.length}`);
  const denseHash = makeDenseHash(options.array);
  console.log(`dense hash ${denseHash}  (${denseHash.length})`);
  const hex = toHex(denseHash);
  return hex;
}

function toHex(denseHash) {
  let value = '';
  denseHash.forEach(n => {
    let h = n.toString(16);
    h = h.length % 2 ? '0' + h : h;
    value += h;
  });
  return value;
}

function makeLengthsList(input) {
  let lengths = [];
  for (let i = 0; i < input.length; i++) {
    lengths.push(input.charCodeAt(i));
  }
  lengths = lengths.concat([17, 31, 73, 47, 23]);
  console.log(`lengths: ${lengths}`);
  return lengths;
}

function makeDenseHash(sparseHash) {

  const result = [];
  for (let i = 0; i < sparseHash.length - 15; i += 16) {
    //console.log(`dh element starting at ${i}`);
    const element = sparseHash[i] ^
      sparseHash[i + 1] ^
      sparseHash[i + 2] ^
      sparseHash[i + 3] ^
      sparseHash[i + 4] ^
      sparseHash[i + 5] ^
      sparseHash[i + 6] ^
      sparseHash[i + 7] ^
      sparseHash[i + 8] ^
      sparseHash[i + 9] ^
      sparseHash[i + 10] ^
      sparseHash[i + 11] ^
      sparseHash[i + 12] ^
      sparseHash[i + 13] ^
      sparseHash[i + 14] ^
      sparseHash[i + 15];
    result.push(element);
  }
  return result;
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

  (() => {
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
  })();

  (() => {
    const testMakeLengthsList = function (input, expected) {
      test(`makeLengthsList`, assert => {
        const msg = `makeLengthsList with input should return ${util.inspect(expected)}`;
        const value = makeLengthsList(input);
        assert.deepEqual(value, expected, msg);
        assert.end();
      });
    }

    testMakeLengthsList('1,2,3', [49, 44, 50, 44, 51, 17, 31, 73, 47, 23]);
  })();

  (() => {
    const testMakeDenseHash = function (input, expected) {
      test(`makeDenseHash`, assert => {
        const msg = `makeDenseHash with input ${input} should return ${util.inspect(expected)}`;
        const value = makeDenseHash(input);
        assert.deepEqual(value, expected, msg);
        assert.end();
      });
    }

    testMakeDenseHash([65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22], [64]);
    testMakeDenseHash([65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22, 65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22], [64, 64]);
    testMakeDenseHash([65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22, 65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22,65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22], [64, 64, 64]);
    
  })();

  (() => {
    const testToHex = function (input, expected) {
      test(`toHex`, assert => {
        const msg = `toHex with input ${input} should return ${expected}`;
        const value = toHex(input);
        assert.equal(value, expected, msg);
        assert.end();
      });
    }

    testToHex([64, 7, 255], '4007ff');

  })();

  (() => {
    const testSolve = function (input, expected) {
      test(`solve`, assert => {
        const msg = `solve with input ${input} should return ${expected}`;
        const value = solve(256, input);
        assert.equal(value, expected, msg);
        assert.end();
      });
    }

    testSolve('', 'a2582a3a0e66e6e86e3812dcb672a272');
    testSolve('AoC 2017', '33efeb34ea91902bb2f59c9920caa6cd');
    testSolve('1,2,3', '3efbe78a8d82f29979031a4aa0b16a9d');
    testSolve('1,2,4', '63960835bcdc130f0b66d7ff4f6a5a8e');

  })();
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