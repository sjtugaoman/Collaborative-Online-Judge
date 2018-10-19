const express = require('express');
const router = express.Router();

const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();
EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL,'POST');

//Get all the problems
router.get('/problems', function(req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

//Get one problem by id
router.get('/problems/:id', function(req, res) {
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

//Post new problemService
router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
        .then(problem => res.json(problem),
            error => res.status(400).send('problem name already exists'));
});

//Build and Run
router.post('/build_and_run', jsonParser, function(req, res) {
  const userCode = req.body.user_code;
  const lang = req.body.lang;
  console.log('lang', lang, 'code', userCode);

  restClient.methods.build_and_run(
    {data: {code: userCode, lang: lang},
     headers: {'Content-Type': 'application/json'}},
     (data, response) => {
       const text =  `Build output: ${data['build']}, execute output: ${data['run']}`;
       res.json(data);
     }
  )
});

module.exports = router;
