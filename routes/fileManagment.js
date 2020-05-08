const router = require('express').Router();
const dirTree = require('../modules/DirTree');

router.get('/dirtree', (req, res) => {
  res.json(dirTree());
});

router.post('/readfile/', (req, res) => {
  res.send('Hello World:' + req.body.path);
});

module.exports = router;