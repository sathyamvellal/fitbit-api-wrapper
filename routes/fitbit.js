var express = require('express');
var router = express.Router();

var FitbitConfig = require('../config/fitbit');
var FitbitApi = require('../helpers/fitbit');

var fitbitConfig = new FitbitConfig(require('../keys/fitbit'));
var fitbitApiClient = new FitbitApi(fitbitConfig.getConfig());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(fitbitApiClient.getAuthorizationUrl());
});

router.get('/auth/callback', function(req, res, next) {
  fitbitApiClient.getToken(req.query.code)
  .then(data => res.redirect('/fitbit/get/all'))
  .catch(err => res.json(500, err));
});

router.get('/get/all', function(req, res, next) {

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  fitbitApiClient.getAllData({
    fields: {
        date: req.query.date || yesterday.toISOString().substr(0, 10),
        period: '1d',
        detailLevel: '1sec'
    }
  }).then(data => {
    res.json(200, data);
  }).catch(err => {
    res.json(500, err);
  })
})

module.exports = router;
