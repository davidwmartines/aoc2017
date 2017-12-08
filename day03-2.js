'use strict';
const test = require('tape');


function xGenerator() {
  //let counter = 1;
  let x = 0;
  let up = false;
  let step = 0;
  let repIn = 2;
  let repeats = 1;

  return function () {

    if (repIn === 0) {
      step++;
      repeats = step;
    }

    if (repIn === -1) {
      repIn = step * 2;
    }

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




function makePoints(max) {

  const yGen = yGenerator();
  const xGen = xGenerator();

  const points = [];
  let number = 1;

  while (number <= max) {
    const point = {
      number: 0,
      x: xGen(),
      y: yGen()
    };

    const neighbors = getNeighbors(point, points);
    point.neighbors = neighbors;
    neighbors.forEach(n => {
      point.number += n.number;
    });
    if (point.number === 0) {
      point.number = 1;
    }

    if(point.number > 277678){
      console.log('ANSWER', point.number);
      break;
    }

    points.push(point);
    number++;
  }
  return points;
}


function getNeighbors(point, list) {
  return list.filter(other => {
    return (other.x === point.x && ((other.y + 1 === point.y) || (other.y - 1 === point.y))) ||
      (other.y === point.y && ((other.x + 1 === point.x) || (other.x - 1 === point.x))) ||
       (((other.y + 1 === point.y) || (other.y - 1 === point.y)) &&
        (( other.x + 1 === point.x) || (other.x - 1 === point.x)));
  });

}

test('getNeighbors', assert => {

  const points = [{
      x: 0,
      y: 0
    }, {
      x: 1,
      y: 0
    }, {
      x: 1,
      y: -1
    }, {
      x: 0,
      y: -1
    }, {
      x: -1,
      y: -1
    }, {
      x: -1,
      y: 0
    }, {
      x: -1,
      y: 1
    }, {
      x: 0,
      y: 1
    }, {
      x: 1,
      y: 1
    }, {
      x: 2,
      y: 1
    }, {
      x: 2,
      y: 0
    }, {
      x: 2,
      y: -1
    }, {
      x: 2,
      y: -2
    }, {
      x: 1,
      y: -2
    }


  ];

  const expected = [{
    x: 1,
    y: 0
  }, {
    x: 1,
    y: -1
  }, {
    x: 0,
    y: -1
  }, {
    x: -1,
    y: -1
  }, {
    x: -1,
    y: 0
  }, {
    x: -1,
    y: 1
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  }];

  const val = getNeighbors({
    x: 0,
    y: 0
  }, points);
  assert.deepEqual(val, expected);
  assert.end();
});


test('makePoints', assert => {

  const points = makePoints(25);

  // points.forEach(p => {
  //   console.log(`point ${p.x}, ${p.y} (${p.number})`);
  //   p.neighbors.forEach(n => {
  //     console.log(`  n ${n.x}, ${n.y} (${n.number})`);
  //   })
  // })



  assert.equal(points[0].number, 1);
  assert.equal(points[1].number, 1);
  assert.equal(points[2].number, 2);
  assert.equal(points[3].number, 4);
  assert.equal(points[4].number, 5);
  assert.equal(points[5].number, 10);
  assert.equal(points[6].number, 11);
  assert.equal(points[7].number, 23);
  assert.equal(points[8].number, 25);
  assert.equal(points[9].number, 26);
  assert.equal(points[10].number, 54);
  assert.equal(points[16].number, 147);
  assert.equal(points[20].number, 362);
  assert.equal(points[22].number, 806);
  assert.end();
});


makePoints(277678);