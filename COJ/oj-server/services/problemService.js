const ProblemModel = require('../models/problemModel');

const getProblems = function() {
  // return new Promise((resolve, reject) => {
  //   resolve(problems);
  // });
  return new Promise((resolve, reject) => {
       ProblemModel.find({}, (err, problems) => {
           if (err) {
               reject(err);
           } else {
               resolve(problems);
           }
       });
   });
}

const getProblem = function(id) {
  // return new Promise((resolve, reject) => {
  //   resolve(problems.find(problem => problem.id === id));
  // });
  return new Promise((resolve, reject) => {
    ProblemModel.findOne({id: id}, (err, problem) => {
      if(err) {
        reject(err);
      } else {
        resolve(problem);
      }
    });
  });
}

const addProblem = function(newProblem) {
  // return new Promise((resolve, reject) => {
  //   if(problems.find(problem => problem.name === newProblem.name)) {
  //     reject('problem already exists');
  //   } else {
  //     newProblem.id = problems.length + 1;
  //     problems.push(newProblem);
  //     resolve(newProblem);
  //   }
  // });
  return new Promise((resolve, reject) => {
    ProblemModel.findOne({name: newProblem.name}, (err, data) =>{
      if(data) {
        reject('Problem already exists');
      } else {
        //save to mongodb
        ProblemModel.count({}, (err, count) => {
          newProblem.id = count + 1;
          const mongoProblem = new ProblemModel(newProblem);
          mongoProblem.save();
          resolve(mongoProblem);
        });
      }
    });
  });
}

module.exports = {
  getProblems,
  getProblem,
  addProblem
}
