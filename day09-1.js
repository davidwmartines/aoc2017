'use strict';
const test = require('tape');
const fs = require('fs');
const util = require('util');

class Node {
  constructor(string) {
    console.log('  constructing node: ', string);

    this.nodes = [];

    let opens = 0;
    let closes = 0;
    let start = undefined;
    for (let i = 1; i < string.length; i++) {
      const char = string[i];
      //console.log(`   index ${i}, char ${char}`);
      if (char === '{') {
        opens++;
        if (!start) {
          start = i;
        }
      }
      if (char === '}') {
        closes++;
      }
      if (char !== ',') {
        // console.log(`    opens ${opens}, closes ${closes}`);
        if (closes === opens) {
          // console.log(`     adding: start ${start}, end ${i}`);
          this.nodes.push(new Node(string.substring(start, i + 1)));
          start = undefined;
          closes = opens = 0;
        }
      }
    }
  }

  getScore(parentVal) {
    const initialScore = (parentVal || 0) + 1;
    let myScore = initialScore;
    this.nodes.forEach(node => {
      myScore += node.getScore(initialScore);
    });
    return myScore;
  }
}

function clean(input) {
  const output = [];
  let garbage = false;
  let skip = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    //console.log('char', char);
    if (!skip) {

      if (char === '<') {
        garbage = true;
      }
      if (!garbage) {
        //console.log(`pushing index ${i} (${char})`);
        output.push(char);
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
  return ''.concat(...output);
}

function solve(input) {
  const cleaned = clean(input);
  const node = new Node(cleaned);
  return node.getScore();
}

function runTests() {
  const testNodeCtor = function (input, expected) {
    test(`Node.constructor`, assert => {
      const msg = `Node.constructor with ${input} should return ${expected}`;
      const value = new Node(input);
      assert.deepEqual(value, expected, msg);
      //console.log(util.inspect(value, {depth: null}));
      assert.end();
    });
  };

  const testClean = function (input, expected) {
    test(`clean`, assert => {
      const msg = `clean with ${input} should return ${expected || '""'}`;
      const value = clean(input);
      assert.equal(value, expected, msg);
      assert.end();
    });
  };

  const testSolve = function (input, expected) {
    test(`solve`, assert => {
      const msg = `solve with ${input} should return ${expected}`;
      const value = solve(input);
      assert.equal(value, expected, msg);
      assert.end();
    });
  };

  testNodeCtor('{}', {
    nodes: []
  });

  testNodeCtor('{{{}}}', {
    nodes: [{
      nodes: [{
        nodes: []
      }]
    }]
  });

  testNodeCtor('{{},{}}', {
    nodes: [{
      nodes: []
    }, {
      nodes: []
    }]
  });

  testNodeCtor('{{{},{},{{}}}}', {
    nodes: [{
      nodes: [{
        nodes: []
      }, {
        nodes: []
      }, {
        nodes: [{
          nodes: []
        }]
      }]
    }]
  });

  testNodeCtor('{,,,}', {
    nodes: []
  });

  testClean('<>', '');
  testClean('<random characters>', '');
  testClean('<<<<>', '');
  testClean('<{!>}>', '');
  testClean('<!!>', '');
  testClean('<!!!>>', '');
  testClean('<{o"i!a,<{i<a>', '');


  testClean('{<{},{},{{}}>}', '{}');
  testClean('{<a>,<a>,<a>,<a>}', '{,,,}');
  testClean('{{<a>},{<a>},{<a>},{<a>}}', '{{},{},{},{}}');
  testClean('{{<!>},{<!>},{<!>},{<a>}}', '{{}}');

  testClean('{{<!!>},{<!!>},{<!!>},{<!!>}}', '{{},{},{},{}}');

  testSolve('{}', 1);
  testSolve('{{{}}}', 6);
  testSolve('{{},{}}', 5);
  testSolve('{{{},{},{{}}}}', 16);
  testSolve('{<a>,<a>,<a>,<a>}', 1);
  testSolve('{{<ab>},{<ab>},{<ab>},{<ab>}}', 9);
  testSolve('{{<!!>},{<!!>},{<!!>},{<!!>}}', 9);

}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day09.txt', {
    encoding: 'utf8'
  });

  console.log('* * ANSWER * *');
  console.log(solve(puzzleInput));
  console.log('* * * * * * * *');
}


runTests();
//solvePuzzle();