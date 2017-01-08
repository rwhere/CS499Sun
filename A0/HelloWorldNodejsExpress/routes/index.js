var express = require('express');
var router = express.Router();

router.get("/a0", function(req, res, next) {
  res.send("<h1>Hello, World!</h1>");
});

module.exports = router;
