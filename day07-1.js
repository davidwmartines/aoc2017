'use strict';
const test = require('tape');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');

function solve(input) {
  const nodeList = parseNodeList(input);
  const rootNode = findRootInNodeList(nodeList);
  return rootNode.name;
}

class Node {
  constructor(name, weight, childrenNames) {
    this.name = name;
    this.weight = weight;
    this.childrenNames = childrenNames;
  }
}

function lineToNode(line) {
  if (line.indexOf('->') > -1) {
    return new Node(
      line.split('->')[0].split(/\s/)[0],
      parseInt(line.split('->')[0].split(/\s/)[1].replace(')', '').replace('(', '')),
      line.split('->')[1].split(',').map(n => n.trim())
    );
  } else {
    return new Node(
      line.split(/\s/)[0],
      parseInt(line.split(/\s/)[1].replace(')', '').replace('(', '')), []
    );
  }
}

function parseNodeList(str) {
  return str.split('\n')
    .filter(l => l.length > 0)
    .map(lineToNode);
}

function findRootInNodeList(nodeList) {
  return nodeList.filter(
    n => n.childrenNames.length > 0 &&
    !(_(nodeList).some(o => _(o.childrenNames).some(cn => cn === n.name)))
  )[0];
}

function runTests() {

  const example = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`;

  const testLineToNode = function (input, expected) {
    test(`lineToNode`, assert => {
      const msg = `lineToNode with ${input} should return ${util.inspect(expected)}`;
      const value = lineToNode(input);
      assert.deepEqual(value, expected, msg);
      assert.end();
    });
  }

  testLineToNode('pbga (66)', new Node('pbga', 66, []));
  testLineToNode('fwft (72) -> ktlj, cntj, xhth', new Node('fwft', 72, ['ktlj', 'cntj', 'xhth']));

  test(`parseNodeList`, assert => {
    const expected = 13;
    const msg = `parseNodeList  should return ${expected}`;
    const value = parseNodeList(example);
    assert.equal(value.length, expected, msg);
    assert.end();
  });

  test(`parseNodeListE0`, assert => {
    const expected = new Node('pbga', 66, []);
    const msg = `parseNodeList  should return ${util.inspect(expected)}`;
    const value = parseNodeList(example);
    assert.deepEqual(value[0], expected, msg);
    assert.end();
  });

  test(`parseNodeListE1`, assert => {
    const expected = new Node('xhth', 57, []);
    const msg = `parseNodeList  should return ${util.inspect(expected)}`;
    const value = parseNodeList(example);
    assert.deepEqual(value[1], expected, msg);
    assert.end();
  });

  test(`findRootInNodeList`, assert => {
    const expected = 'tknk';
    const msg = `findRootInNodeList  should return ${expected}`;
    const nodeList = parseNodeList(example);
    const value = findRootInNodeList(nodeList);
    assert.equal(value.name, expected, msg);
    assert.end();
  });

  test(`solve`, assert => {
    const expected = 'tknk';
    const msg = `solve should return ${expected}`;
    const value = solve(example);
    assert.equal(value, expected, msg);
    assert.end();

  });

}

//runTests();

const puzzleInput = fs.readFileSync('./day07.txt', {
  encoding: 'utf8'
});

console.log('answer', solve(puzzleInput));