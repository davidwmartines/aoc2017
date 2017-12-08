const util = require('util');
const _ = require('lodash');

'use strict';
const test = require('tape');

function countReallocs(arr) {

  let mutated = Array.from(arr);
  let counter = 0;
  const history = [];
  let exists = false;
  while (!exists) {
    counter++;
    mutated = realloc(mutated);
    const str = mutated.join();
    exists = _.some(history, h => h === str);
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

  test(`countReallocs`, assert => {
    const value = countReallocs([0, 2, 7, 0]);
    assert.equal(value, 5, 'should be 5 reallocs');
    assert.end();
  });

}

runTests();

const input = '';
const parsedInput = parse(input);
const count = countReallocs(parsedInput);
console.log('answer', count);