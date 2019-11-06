const router = require('express').Router();
// var mongoose = require('mongoose');
const redisClient = require('../redis-client');
const auth = require('../auth');

router.get('/', auth.optional, (req, res) => {
  return res.send('Hello world');
});
// put a job
router.put('/:job', auth.optional, async (req, res) => {
  const { job } = req.params;
  const value = req.query;
  await redisClient.zAddAsync("jobs", job, JSON.stringify(value));
  // await redisClient.setAsync(key, JSON.stringify(value));

  return res.json({result: "success"});
});

// get a job
router.get('/:job', auth.optional, async (req, res) => {
  const { job } = req.params;
  const rawData = await redisClient.zRangeByScoreAsync("jobs", 0, job);
  return res.json(JSON.parse(JSON.stringify({ "jobs": [rawData]})));

});

module.exports = router;
