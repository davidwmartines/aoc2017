'use strict';
const test = require('tape');
const fs = require('fs');

function solve(input) {
  const scanners = input.split('\n').map(l => {
    return {
      depth: parseInt(l.split(':')[0]),
      range: parseInt(l.split(':')[1].trim()),
      direction: 'd',
      currentLevel: 0
    };
  });

  const layerCount = scanners.map(s => s.depth).sort((a, b) => b - a)[0] + 1;
  console.log('layerCount', layerCount);

  const scannersCaughtBy = [];
  for (let currentLayer = 0; currentLayer < layerCount; currentLayer++) {

    const currentScanner = scanners.find(s => s.depth === currentLayer);
    if (currentScanner) {
      if (currentScanner.currentLevel === 0) {
        scannersCaughtBy.push(currentScanner);
        console.log('caught by scanner ', currentScanner);
      }
    }

    scanners.forEach(scanner => {
      if (scanner.currentLevel === scanner.range - 1) {
        scanner.currentLevel--;
        scanner.direction = 'u';
      } else if (scanner.direction === 'u') {
        if (scanner.currentLevel === 0) {
          scanner.direction = 'd';
          scanner.currentLevel++;
        } else {
          scanner.currentLevel--;
        }
      } else if (scanner.direction === 'd') {
        scanner.currentLevel++;
      }
    });

  }

  return scannersCaughtBy.reduce((acc, scanner) => {
    return acc + (scanner.depth * scanner.range);
  }, 0);

}

function runTests() {

  const example = `0: 3
1: 2
4: 4
6: 4`;

  test(`solve`, assert => {
    const result = solve(example);
    assert.equal(result, 24, 'example should be 24');
    assert.end();
  });
}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day13.txt', {
    encoding: 'utf8'
  });

  const answer = solve(puzzleInput);
  console.log('* * ANSWER * *');
  console.log(answer);
  console.log('* * * * * * * *');
}

//runTests();
solvePuzzle();