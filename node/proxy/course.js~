var EventProxy = require('eventproxy');

var models = require('../models');
var Course = models.Course;
var User = require('./user');
var tools = require('../common/tools');
var at = require('../common/at');

/**根据课程ID获取课程
*/
exports.getCourseById = function (id, callback) {
  var proxy = new EventProxy();
  var events = ['course', 'author'];
  proxy.assign(events, function (topic, author) {
    if (!author) {
	return callback(null,null,null);
    }
    return callback(null, course, author);
  }).fail(callback);

  Course.findOne({_id: id}, proxy.done(function (course) {
    if (!course) {
      proxy.emit('course', null);
      proxy.emit('author', null);
      return;
    }
    proxy.emit('course', course);

    User.getUserById(course.author_id, proxy.done('author'));
};

//for sitemap
exports.getLimit5w = function(callback) {
  Course.find({deleted: false}, '_id', {limit: 50000, sort: '-create_at'},callback);
};

exports.getCourse = function (id, callback) {
  Course.findOne({_id:id},callback);
};

exports.newAndSave = function (name,authorId,courseId,callback) {
  var course = new Course();
  course.name = name;
  course.author_id = authorId;
  course.course_id = courseId;
  course.save(callback);
};
