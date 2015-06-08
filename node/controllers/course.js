var validator = require('validator');

var at = require('../common/at');
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var TopicCollect = require('../proxy').TopicCollect;
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var store = require('../common/store');
var config = require('../config');
var _ = require('lodash');
var cache = require('../common/cache');
var Course = require('../proxy').Course;
var CourseCollect = require('../proxy').CourseCollect;

exports.create = function (req, res, next) {
  res.render('course/edit', {
    tabs: config.tabs
  });
};
exports.put = function (req, res, next) {
  var courseName = req.param('courseName');
  var teacherName =  req.param('teacherName');
  // Course.newAndSave(courseName, teacherName,function (err, topic) {
  //   if (err) {
  //     return next(err);
  //   }
  // });
  console.log("课程名:"+courseName);
  console.log("教师名:"+teacherName);
  res.redirect('/');
};