const router = require('express').Router();
const seasonsController = require('../controllers/seasonsController');

router
    .route('/')
    .get(seasonsController.findAll);

module.exports = router;