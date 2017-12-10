'use strict';
const test = require('tape');
const fs = require('fs');

function clean(input) {
  let garbageChars = [];
  const output = [];
  let garbage = false;
  let skip = false;
  let startGarb = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    startGarb = false;
    if (!skip) {

      if (char === '<') {

        if (!garbage) {
          startGarb = true;
        }
        garbage = true;
      }

      if (!garbage) {
        output.push(char);
      } else {
        if (!startGarb) {
          if (char !== '>' && char !== '!') {
            garbageChars.push(char);
          }
        }

      }

      if (char === '>') {
        garbage = false;
      }

    }

    if ((!skip) && (char === '!')) {
      skip = true;
    } else {
      skip = false;
    }

  }
  return {
    cleaned: ''.concat(...output),
    garbageChars
  };
}

function runTests() {

  const testClean = function (input, expected) {
    test(`clean`, assert => {
      const msg = `clean with ${input} should return ${expected || '""'}`;
      const res = clean(input);
      assert.equal(res.garbageChars.length, expected, msg);
      assert.end();
    });
  };


  testClean('<>', 0);
  testClean('<random characters>', 17);
  testClean('<<<<>', 3);
  testClean('<{!>}>', 2);
  testClean('<!!>', 0);
  testClean('<!!!>>', 0);
  testClean('<{o"i!a,<{i<a>', 10);

}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day09.txt', {
    encoding: 'utf8'
  });

  const result = clean(puzzleInput);
  //console.log('result', result);
  const answer = result.garbageChars.length;
  console.log('* * ANSWER * *');
  console.log(answer);
  console.log('* * * * * * * *');
}


//runTests();
solvePuzzle();