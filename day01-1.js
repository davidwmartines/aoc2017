const fs = require('fs');

const input = fs.readFileSync('./day01.txt', {
  encoding: 'utf8'
});

//const input = '91212129';

//console.log(input);
let total  = 0;
for (let i = 0; i < input.length; i ++) {
  const digit = parseInt(input[i]);
  const next = parseInt(input[i === input.length - 1 ? 0 : i + 1]);

  if (digit === next) {
    total += digit;
  }

}

console.log(total);