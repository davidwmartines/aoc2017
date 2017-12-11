'use strict';
const test = require('tape');
const fs = require('fs');
const util = require('util');

const hexMoves = {
  n: {
    x: 0,
    y: 2
  },
  ne: {
    x: 1,
    y: 1
  },
  e: {
    x: 2,
    y: 0
  },
  se: {
    x: 1,
    y: -1
  },
  s: {
    x: 0,
    y: -2
  },
  sw: {
    x: -1,
    y: -1
  },
  w: {
    x: -2,
    y: 0
  },
  nw: {
    x: -1,
    y: 1
  }
};

function move(start, dir) {
  const amount = hexMoves[dir];
  const dest = {
    x: (start.x + amount.x),
    y: (start.y + amount.y)
  };
  return dest;
}

function solve(input) {

}

function runTests() {

  function testMovement() {
    function testMove(start, dir, dest) {
      test(`move`, assert => {
        const msg = `move ${dir} from ${util.inspect(start)} should arrive at ${util.inspect(dest)}`;
        const value = move(start, dir);
        assert.deepEqual(value, dest, msg);
        assert.end();
      });
    }

    testMove({
      x: 0,
      y: 0
    }, 'n', {
      x: 0,
      y: 2
    });

    testMove({
      x: 0,
      y: 0
    }, 'e', {
      x: 2,
      y: 0
    });

    testMove({
      x: 0,
      y: 0
    }, 's', {
      x: 0,
      y: -2
    });

    testMove({
      x: 0,
      y: 0
    }, 'w', {
      x: -2,
      y: 0
    });

    testMove({
      x: 0,
      y: 0
    }, 'ne', {
      x: 1,
      y: 1
    });

    testMove({
      x: 0,
      y: 0
    }, 'se', {
      x: 1,
      y: -1
    });

    testMove({
      x: 0,
      y: 0
    }, 'sw', {
      x: -1,
      y: -1
    });

    testMove({
      x: 0,
      y: 0
    }, 'sw', {
      x: -1,
      y: -1
    });

    testMove({
      x: 0,
      y: 0
    }, 'nw', {
      x: -1,
      y: 1
    });

    testMove({
      x: 10,
      y: 10
    }, 'nw', {
      x: 9,
      y: 11
    });

    testMove({
      x: -10,
      y: -10
    }, 'nw', {
      x: -11,
      y: -9
    });

    testMove({
      x: 10,
      y: 10
    }, 'n', {
      x: 10,
      y: 12
    });

    testMove({
      x: -10,
      y: -10
    }, 'n', {
      x: -10,
      y: -8
    });

    testMove({
      x: 10,
      y: 10
    }, 'nw', {
      x: 9,
      y: 11
    });

    testMove({
      x: -10,
      y: -10
    }, 'sw', {
      x: -11,
      y: -11
    });

    testMove({
      x: 10,
      y: 10
    }, 's', {
      x: 10,
      y: 8
    });

    testMove({
      x: -10,
      y: -10
    }, 's', {
      x: -10,
      y: -12
    });
  }

  testMovement();


}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day0.txt', {
    encoding: 'utf8'
  });

  console.log('* * ANSWER * *');
  console.log(solve(puzzleInput));
  console.log('* * * * * * * *');
}


runTests();
//solvePuzzle();