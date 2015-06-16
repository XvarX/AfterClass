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
  var events = ['course', 'teacher'];

  proxy.assign(events, function (course, teacher) {
    if (!teacher) {
	   return callback(null, null);
    }
    return callback(course, teacher);
  }).fail(callback);

  Course.findOne({_id: id}, proxy.done(function (course) {
    if (!course) {
      proxy.emit('course', null);
      proxy.emit('teacher', null);
      return;
    }
    proxy.emit('course', course);
  }));

  User.getUserById(course.teacher_id, proxy.done('teacher'));
};

//for sitemap
exports.getLimit5w = function(callback) {
  Course.find({deleted: false}, '_id', {limit: 50000, sort: '-create_at'},callback);
};

exports.getCourse = function (id, callback) {
  Course.findOne({_id:id},callback);
};

exports.getCourseByName = function (name, callback) {
  Course.findOne({name: name}, callback);
};

exports.newAndSave = function (name, teacher_id, callback) {
  var course = new Course();
  course.name = name;
  course.teacher_id = teacher_id;
  console.log('newing course')
  console.log(course);
  console.log(Course);
  course.save(callback);
};

exports.getCoursesByUserId = function (id, callback) {
  User.getUserById(id, function(err, user) {
    Course.find({
      collect_user: user.id
    },callback);
  });
};

exports.getAllCourses = function (callback) {
  Course.find({}, callback);
};