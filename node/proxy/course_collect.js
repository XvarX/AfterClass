var TopicCollect = require('../models').CourseCollect;

exports.getCourseCollect = function (userId, courseId, callback) {
  CourseCollect.findOne({user_id: userId, course_id: courseId}, callback);
};

exports.getCourseCollectsByUserId = function (userId, callback) {
  CourseCollect.find({user_id: userId}, callback);
};

exports.newAndSave = function (userId, courseId, callback) {
  var course_collect = new CourseCollect();
  course_collect.user_id = userId;
  course_collect.course_id = topicId;
  course_collect.save(callback);
};

exports.remove = function (userId, courseId, callback) {
  CourseCollect.remove({user_id: userId, course_id: courseId}, callback);
};
