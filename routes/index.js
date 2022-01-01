const router = require('express').Router();
const seasonRoutes = require('./seasons');

router.use('/api/seasons', seasonRoutes);

module.exports = router;