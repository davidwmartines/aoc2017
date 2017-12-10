'use strict';
const test = require('tape');
const fs = require('fs');
const util = require('util');

class Node {
  constructor(string) {
    console.log('---------------- constructing node: ', string);

    this.nodes = [];

    let opens = 0;
    let closes = 0;
    let start = undefined;
    for (let i = 1; i < string.length; i++) {
      const char = string[i];
      console.log(`index ${i}, char ${char}`);
      if (char === '{') {
        opens++;
        if(!start){
          start = i;
        }
      }
      if (char === '}') {
        closes++;
      }
      if (char !== ',') {
        console.log(`  opens ${opens}, closes ${closes}`);
        if (closes === opens) {
          console.log(`   adding: start ${start}, end ${i}`);
          this.nodes.push(new Node(string.substring(start, i+1)));
          start = undefined;
          closes = opens = 0;
        }
      }

    }
  }
}

function clean(input){

}

function solve(input) {

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
      const msg = `clean with ${input} should return ${expected}`;
      const value = clean(input);
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

  //testClean('{<{},{},{{}}>}', '{}');


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