const express = require('express');
const _ = require('lodash');
const fs = require('fs');

const app = express();
let users;

fs.readFile('users.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  users = JSON.parse(data).map((user) => Object.assign(
    {},
    user,
    {
      name: {
        first: user.name.first,
        last: user.name.last,
        full: _.startCase(`${user.name.first} ${user.name.last}`),
      },
    }
  ));
});

app.get('/', (req, res) => {
  let buffer = '';

  users.forEach((user) => {
    buffer += `<a href="/${user.username}">${user.name.full}</a><br/>`;
  });

  res.send(buffer);
});

// SIMILAR TO HOOKS (PRE-HOOK IN THAT CASE)
app.get(/big.*/, (req, res, next) => {
  console.log('BIG USER ACCESS');
  next();
});


app.get(/.*dog.*/, (req, res, next) => {
  console.log('DOGS GO WOOF');
  next();
});


app.get('/:username', ({ params }, res) => {
  const username = params.username;
  res.send(username);
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});
