'use strict';
const test = require('tape');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');

function solve(input) {
  const list = parseInput(input);
  const program = list.find(p => p.id === 0);
  const connectedIds = program.listAllConnectionIds(list);
  return connectedIds.length;
}

function parseInput(input) {
  return input.split('\n').map(l => new Node(l));
}

class Node {
  constructor(line) {
    const parts = line.split('<->');
    this.id = parseInt(parts[0].trim());
    this.connectionIds = [];
    parts[1].split(',').forEach(n => {
      this.connectionIds.push(parseInt(n.trim()))
    });
  }

  populateConnections(sourceList, exclude) {
    //console.log('populate connections for ', this.id);
    exclude = exclude || [];
    this.connections = [];
    this.connectionIds.forEach(id => {
      //console.log('find connected ', id);
      const connected = sourceList
        .find(s => s.id === id &&
          s.id !== this.id &&
          !exclude.includes(id));
      if (connected) {
        //console.log('found', connected.id);
        exclude.push(connected.id);
        connected.populateConnections(sourceList, exclude);
        this.connections.push(connected);
      }
    });
  }

  listAllConnections(exclude) {
    //console.log('listAllConnections', this.id);
    exclude = exclude || [];
    const list = [];
    this.connections
      .filter(c => !exclude.includes(c.id))
      .forEach(c => {
        exclude.push(c.id);
        c.listAllConnections(exclude).forEach(cc => list.push(cc));
        list.push(c);
      });
    return list;
  }

  listAllConnectionIds(sourceList) {
    this.populateConnections(sourceList);
    return _.uniq(this.listAllConnections().concat(this).map(n => n.id)).sort();
  }
}

function runTests() {

  const example = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`;

  function testNodeConstructor() {

    function testConstructor(input, expected) {
      test('Node.constructor', assert => {
        const msg = `Node constructor with ${input} should return ${util.inspect(expected)}`;
        const value = new Node(input);
        assert.deepEqual(value, expected, msg);
        assert.end();
      });
    }

    testConstructor('0 <-> 2', {
      id: 0,
      connectionIds: [2]
    });

    testConstructor('1 <-> 1', {
      id: 1,
      connectionIds: [1]
    });

    testConstructor('2 <-> 0, 3, 4', {
      id: 2,
      connectionIds: [0, 3, 4]
    });
  }

  function testParseInput() {
    test('parseInput', assert => {
      const list = parseInput(example);
      assert.equal(list.length, 7, 'parseInput should create 7 nodes');
      assert.deepEqual(list[0], {
        id: 0,
        connectionIds: [2]
      }, 'parseInput should create first node');
      assert.deepEqual(list[6], {
        id: 6,
        connectionIds: [4, 5]
      }, 'parseInput should create last node');
      assert.end();

    });
  }

  function testListAllConnectionIds() {
    const nodeList = parseInput(example);

    function testNode(node, expected) {
      test('Node.listAllConnectionIds', assert => {
        const msg = `Node listAllConnectionIds with id of ${node.id} should return ${util.inspect(expected)}`;
        const value = node.listAllConnectionIds(nodeList);
        assert.deepEqual(value, expected, msg);
        assert.end();
      });
    }

    testNode(nodeList[1], [1]);
    testNode(nodeList[0], [0, 2, 3, 4, 5, 6]);

  }

  testNodeConstructor();
  testParseInput();
  testListAllConnectionIds();

  test('solve', assert => {
    const a = solve(example);
    assert.equal(a, 6, 'solution to example should be 6');
    assert.end();
  });

}

function solvePuzzle() {
  const puzzleInput = fs.readFileSync('./day12.txt', {
    encoding: 'utf8'
  });

  const answer = solve(puzzleInput);
  console.log('* * ANSWER * *');
  console.log(answer);
  console.log('* * * * * * * *');
}


//runTests();
solvePuzzle();