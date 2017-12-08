const _ = require('lodash');

'use strict';
const test = require('tape');

function countReallocLoopSize(arr) {

  let mutated = Array.from(arr);
  let counter = 0;
  const history = [];
  let exists = false;
  let looped = false;
  while (!looped) {
    counter++;
    mutated = realloc(mutated);
    const str = mutated.join();
    if (!exists) {
      exists = _.some(history, h => h === str);
      if (exists) {
        counter = 0;
      }
    } else {
      looped = _.filter(history, h => h === str).length >= 2;
    }
    history.push(str);
  }
  return counter;
}

function parse(str) {
  return str
    .split(/\s/)
    .filter(e => {
      return e.replace(/\s/) !== '';
    })
    .map(e => parseInt(e));
}

function realloc(arr) {

  const re = Array.from(arr);
  const map = arr.map((v, i) => {
    return {
      v,
      i
    }
  });
  //console.log('map', map);
  let sorted = _.sortBy(map, 'v');
  //console.log('sorted', sorted);
  if (_.uniq(sorted, v => v.v === sorted[sorted.length - 1].v).length > 1) {
    sorted = _.sortBy(sorted.filter(f => f.v === sorted[sorted.length - 1].v), e => e.i * -1);
    //console.log('sorted', sorted);
  }

  // map.sort((a, b) => {
  //   if (a.v === b.v) {
  //     return a.i - b.i;
  //   } else {
  //     return a.v - b.v;
  //   }
  // });
  const sourceIndex = sorted[sorted.length - 1].i;
  //console.log('sourceIndex', sourceIndex);

  let sourceVal = arr[sourceIndex];
  re[sourceIndex] = 0;
  for (let i = sourceIndex + 1; sourceVal > 0; i++) {
    if (i > re.length - 1) {
      i = 0;
    }
    re[i] += 1;
    sourceVal--;
  }
  return re;
}



function runTests() {

  test(`parse`, assert => {
    const input = '0  2 7 0';
    const expected = [0, 2, 7, 0];
    const msg = `parse with ${input} should return ${expected}`;
    const value = parse(input);
    assert.deepEqual(value, expected, msg);
    assert.end();
  });


  const testRealloc = function (input, expected) {
    test(`realloc`, assert => {
      const msg = `realloc with ${input} should return ${expected}`;
      const value = realloc(input);
      assert.deepEqual(value, expected, msg);
      assert.end();
    });
  }

  testRealloc([0, 2, 7, 0], [2, 4, 1, 2]);
  testRealloc([2, 4, 1, 2], [3, 1, 2, 3]);
  testRealloc([3, 1, 2, 3], [0, 2, 3, 4]);
  testRealloc([0, 2, 3, 4], [1, 3, 4, 1]);
  testRealloc([1, 3, 4, 1], [2, 4, 1, 2]);

  test(`countReallocLoopSize`, assert => {
    const value = countReallocLoopSize([0, 2, 7, 0]);
    assert.equal(value, 4, 'loop size should be 4.');
    assert.end();
  });

}

runTests();

const input = '11	11	13	7	0	15	5	5	4	4	1	1	7	1	15	11';
const parsedInput = parse(input);
const count = countReallocLoopSize(parsedInput);
console.log('answer', count);