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

function followPath(start, path) {
  const moves = path.split(',');
  let dest;
  const distances = [];

  moves.forEach(m => {
    dest = move(dest || start, m);
    //console.log(`moved to ${util.inspect(dest)}`);
    const distance = calculateDistance(start, dest);
    distances.push(distance);
  });
  return {
    dest,
    distances
  }
}

function determineDirection(from, to) {
  let dir;
  if (from.x === to.x && from.y < to.y) {
    dir = 'n';
  }
  if (from.x < to.x && from.y === to.y) {
    dir = 'e';
  }
  if (from.x === to.x && from.y > to.y) {
    dir = 's';
  }
  if (from.x > to.x && from.y === to.y) {
    dir = 'w';
  }
  if (from.x < to.x && from.y < to.y) {
    dir = 'ne';
  }

  if (from.x > to.x && from.y > to.y) {
    dir = 'sw';
  }
  if (from.x > to.x && from.y < to.y) {
    dir = 'nw';
  }
  if (from.x < to.x && from.y > to.y) {
    dir = 'se';
  }

  return dir;
}

function calculateDistance(from, to) {
  let distance = 0;
  let current = from;
  while (current.x !== to.x || current.y !== to.y) {
    const dir = determineDirection(current, to);
    //console.log(`${util.inspect(current)} to ${util.inspect(to)} determined to be ${dir}`);
    current = move(current, dir);
    //console.log(`current now ${util.inspect(current)}`);
    distance++;
  }
  return distance;
}

function solve(input) {
  const start = {
    x: 0,
    y: 0
  };
  const result = followPath(start, input);
  return result.distances.sort((a,b)=> b-a)[0];

  //return calculateDistance(location, start);
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

  function testFollowPath() {

    function testFollow(start, path, dest) {
      test(`followPath`, assert => {
        const msg = `followPath ${path} from ${util.inspect(start)} should arrive at ${util.inspect(dest)}`;
        const value = followPath(start, path);
        assert.deepEqual(value.dest, dest, msg);
        assert.end();
      });
    }

    testFollow({
      x: 0,
      y: 0
    }, 'ne,ne,ne', {
      x: 3,
      y: 3
    });

    testFollow({
      x: 0,
      y: 0
    }, 'ne,ne,sw,sw', {
      x: 0,
      y: 0
    });

    testFollow({
      x: 0,
      y: 0
    }, 'ne,ne,s,s', {
      x: 2,
      y: -2
    });

    testFollow({
      x: 0,
      y: 0
    }, 'se,sw,se,sw,sw', {
      x: -1,
      y: -5
    });

  }

  function testDetermineDirection() {
    function testDir(from, to, expected) {
      test(`determineDirection`, assert => {
        const msg = `direction from ${util.inspect(from)} to ${util.inspect(to)} should be ${expected}.`;
        const value = determineDirection(from, to);
        assert.equal(value, expected, msg);
        assert.end();
      });

    }

    testDir({
      x: 0,
      y: -1
    }, {
      x: 0,
      y: 0
    }, 'n');

    testDir({
      x: 0,
      y: 1
    }, {
      x: 0,
      y: 0
    }, 's');

    testDir({
      x: -1,
      y: 0
    }, {
      x: 0,
      y: 0
    }, 'e');

    testDir({
      x: 1,
      y: 0
    }, {
      x: 0,
      y: 0
    }, 'w');

    testDir({
      x: -1,
      y: -1
    }, {
      x: 0,
      y: 0
    }, 'ne');

    testDir({
      x: 1,
      y: -1
    }, {
      x: 0,
      y: 0
    }, 'nw');

    testDir({
      x: 1,
      y: 1
    }, {
      x: 0,
      y: 0
    }, 'sw');

    testDir({
      x: -1,
      y: 1
    }, {
      x: 0,
      y: 0
    }, 'se');


  }

  function testCalculateDistance() {

    function testCalc(from, to, expected) {
      test(`calculateDistance`, assert => {
        const msg = `distance from ${util.inspect(from)} to ${util.inspect(to)} should be ${expected} moves.`;
        const value = calculateDistance(from, to);
        assert.deepEqual(value, expected, msg);
        assert.end();
      });
    }

    const to = {
      x: 0,
      y: 0
    };

    testCalc({
      x: 0,
      y: 0
    }, to, 0);

    testCalc({
      x: 3,
      y: 3
    }, to, 3);

    testCalc({
      x: 2,
      y: -2
    }, to, 2);

    testCalc({
      x: -1,
      y: -5
    }, to, 3);

  }

  function testSolve() {

    function solveTest(input, expected) {
      test('solve', assert => {
        const msg = `solve ${input} should be ${expected}`;
        const value = solve(input);
        assert.equal(value, expected, msg);
        assert.end();
      });
    }

    solveTest('ne,ne,ne', 3);
    solveTest('ne,ne,sw,sw', 0);
    solveTest('ne,ne,s,s', 2);
    solveTest('se,sw,se,sw,sw', 3);
  }

  testMovement();
  testFollowPath();
  testDetermineDirection();
  testCalculateDistance();
  //testSolve();

}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day11.txt', {
    encoding: 'utf8'
  });

  const answer = solve(puzzleInput);
  console.log('* * ANSWER * *');
  console.log(answer);
  console.log('* * * * * * * *');
}


//runTests();
solvePuzzle();