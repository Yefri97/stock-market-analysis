const router = require('express').Router();
const seasonsController = require('../controllers/seasonsController');

router
    .route('/getSeasonalExchangeRate')
    .get(seasonsController.getSeasonalExchangeRate);

router
    .route('/getExchangeRateDaily')
    .get(seasonsController.getExchangeRateDaily);

module.exports = router;