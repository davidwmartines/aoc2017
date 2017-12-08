'use strict';
const test = require('tape');

function solve(input) {
  const points = makePoints(input);
  const square = points[input-1];
  console.log('square', square);
  return (Math.abs(square.x) + Math.abs(square.y));
}


function makePoints(max) {

  const yGen = yGenerator();
  const xGen = xGenerator();

  const points = [];
  let number = 1;

  while (number <= max) {
    const point = {
      number: number,
      x: xGen(),
      y: yGen()
    };
    points.push(point);
    number++;
  }
  return points;
}


function xGenerator() {
  //let counter = 1;
  let x = 0;
  let up = false;
  let step = 0;
  let repIn = 2;
  let repeats = 1;

  return function () {
    //console.log('-----------');
    //console.log('counter', counter);


    if (repIn === 0) {
      step++;
      repeats = step;
    }
    //console.log('step', step);
    //console.log('repeats', repeats);


    if (repIn === -1) {
      repIn = step * 2;
    }
    //console.log('repIn', repIn);

    if (repeats === 1) {
      up = !up;
    }

    if (repeats === 0) {
      if (up) {
        x++;
      } else {
        x--;
      }
    } else {
      repeats--;
    }

    repIn--;

    // counter++;

    //console.log('x', x);
    return x;
  };

}

test('xGenerator', assert => {
  const gen = xGenerator();
  assert.equal(gen(), 0);
  assert.equal(gen(), 1);
  assert.equal(gen(), 1);
  assert.equal(gen(), 0);
  assert.equal(gen(), -1);
  assert.equal(gen(), -1);
  assert.equal(gen(), -1);
  assert.equal(gen(), 0);
  assert.equal(gen(), 1);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 1);
  assert.equal(gen(), 0);
  assert.equal(gen(), -1);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.end();
});

function yGenerator() {
  let counter = 1;
  let y = 0;
  let up = true;
  let step = 1
  let repIn = 2;
  let repeats = 1;

  return function () {

    if (counter === 1) {

      counter++;
      console.log('y', 0);
      return 0;
    }

    if (repIn === 0) {
      step++;
      repeats = step;
    }

    if (repIn === -1) {
      if (step === 1) {
        repIn = 2;
      } else {
        repIn = step + (step - 1);
      }

    }

    if (repeats === 1) {
      up = !up;
    }

    if (repeats === 0) {
      if (up) {
        y++;
      } else {
        y--;
      }
    } else {
      repeats--;
    }

    repIn--;

    counter++;

    //console.log('y', y);
    return y;
  };

}

test('yGenerator', assert => {
  const gen = yGenerator();
  assert.equal(gen(), 0);
  assert.equal(gen(), 0);
  assert.equal(gen(), -1);
  assert.equal(gen(), -1);
  assert.equal(gen(), -1);
  assert.equal(gen(), 0);
  assert.equal(gen(), 1);
  assert.equal(gen(), 1);
  assert.equal(gen(), 1);
  assert.equal(gen(), 1);
  assert.equal(gen(), 0);
  assert.equal(gen(), -1);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -2);
  assert.equal(gen(), -1);
  assert.equal(gen(), 0);
  assert.equal(gen(), 1);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.equal(gen(), 2);
  assert.end();
});



const runTest = function (input, expected) {
  test(`solve`, assert => {
    const msg = `solve with ${input} should return ${expected}`;
    const value = solve(input);
    assert.equal(value, expected, msg);
    assert.end();
  });
}

runTest(1, 0);
runTest(12, 3);
runTest(23, 2);
runTest(1024, 31);


console.log('answer', solve(277678));