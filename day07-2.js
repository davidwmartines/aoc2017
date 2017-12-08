'use strict';
const test = require('tape');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');

class Node {
  constructor(name, weight, childrenNames) {
    this.name = name;
    this.weight = weight;
    this.childrenNames = childrenNames || [];
    this.nodes = [];
  }

  addChild(childNode) {
    this.nodes.push(childNode);
  }

  getTotalWeight() {
    let totalWeight = this.weight;
    this.nodes.forEach(child => {
      totalWeight += child.getTotalWeight();
    });
    return totalWeight;
  }

  getUnbalancedChild() {
    let unbalanced = undefined;
    const uniqueWeights = _.uniq(this.nodes.map(n => n.getTotalWeight()));
    if (uniqueWeights.length > 1) {
      uniqueWeights.forEach(w => {
        const nodesOf = this.nodes.filter(n => n.getTotalWeight() === w);
        if (nodesOf.length === 1) {
          unbalanced = nodesOf[0];
          const ubtw = unbalanced.getTotalWeight();
          const correctTotal = uniqueWeights.filter(uw => uw !== w)[0];
          console.log(`  Unbalanced: ${unbalanced.name} (${ubtw}).  Should be ${correctTotal}.`);
          let diff;
          if (ubtw > correctTotal) {
            diff = ubtw - correctTotal;
            unbalanced.desiredWeight = unbalanced.weight - diff;
          } else {
            diff = correctTotal - ubtw;
            unbalanced.desiredWeight = unbalanced.weight + diff;
          }
          console.log(`  Diff ${diff}.  desired ${unbalanced.desiredWeight}.`);
        }
      });
    }
    return unbalanced;
  }
}

function solve(input) {

  const nodeList = parseNodeList(input);
  const root = findRootInNodeList(nodeList);
  addChildNodes(root, nodeList);

  let found = false;
  let testNode = root;
  let unbalancedChild = null;
  while (!found) {
    unbalancedChild = testNode.getUnbalancedChild();
    if (!unbalancedChild) {
      unbalancedChild = testNode;
      found = true;
    }
    testNode = unbalancedChild;
  }
  console.log('***************** Found Unbalanced Child:', unbalancedChild.name);
  return unbalancedChild.desiredWeight;
}

function addChildNodes(parent, nodeList) {
  parent.childrenNames.forEach(cn => {
    const childNode = nodeList.filter(n => n.name === cn)[0];
    addChildNodes(childNode, nodeList);
    parent.addChild(childNode);
  });
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

  test('addChildNodes', assert => {
    const nodeList = parseNodeList(example);
    const root = findRootInNodeList(nodeList);

    addChildNodes(root, nodeList);

    assert.deepEqual(_.map(root.nodes, 'name'), ['ugml', 'padx', 'fwft'], 'root should have three children');
    assert.deepEqual(_.map(root.nodes[0].nodes, 'name'), ['gyxo', 'ebii', 'jptl'], 'first child should have three children');
    assert.end();

  });

  test('getTotalWeight', assert => {
    const nodeList = parseNodeList(example);
    const root = findRootInNodeList(nodeList);

    addChildNodes(root, nodeList);

    assert.equal(root.nodes[0].getTotalWeight(), 251, 'node 0 should calculate to 251');
    assert.equal(root.nodes[1].getTotalWeight(), 243, 'node 1 should calculate to 243');
    assert.equal(root.nodes[2].getTotalWeight(), 243, 'node 2 should calculate to 243');
    assert.end();

  });

  test('getUnbalancedChild', assert => {
    const nodeList = parseNodeList(example);
    const root = findRootInNodeList(nodeList);

    addChildNodes(root, nodeList);

    assert.equal(root.getUnbalancedChild().name, 'ugml', 'ugml should be the unbalanced child of root');
    assert.equal(root.getUnbalancedChild().desiredWeight, 60, 'ugml desired weight should be 60');

    assert.is(root.nodes[0].getUnbalancedChild(), undefined, 'child 0 should report no unbalanced children');
    assert.is(root.nodes[1].getUnbalancedChild(), undefined, 'child 1 should report no unbalanced children');
    assert.is(root.nodes[2].getUnbalancedChild(), undefined, 'child 2 should report no unbalanced children');
    assert.end();

  });

  test('getUnbalancedChild-TooLight', assert => {

    const lightExample = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (55) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`;

    const nodeList = parseNodeList(lightExample);
    const root = findRootInNodeList(nodeList);

    addChildNodes(root, nodeList);

    assert.equal(root.getUnbalancedChild().name, 'ugml', 'ugml should be the unbalanced child of root');
    assert.equal(root.getUnbalancedChild().desiredWeight, 60, 'ugml desired weight should be 60');
    assert.end();

  });

  test(`solve`, assert => {
    const expected = 60;
    const msg = `solve should return ${expected}`;
    const value = solve(example);
    assert.equal(value, expected, msg);
    assert.end();

  });

}

runTests();

const puzzleInput = fs.readFileSync('./day07.txt', {
  encoding: 'utf8'
});

console.log('answer', solve(puzzleInput));