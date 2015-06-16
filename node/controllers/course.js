var validator = require('validator');

var at = require('../common/at');
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var TopicCollect = require('../proxy').TopicCollect;
var Course = require('../proxy').Course;
var eventproxy = require('eventproxy');
var tools = require('../common/tools');
var store = require('../common/store');
var config = require('../config');
var _ = require('lodash');
var cache = require('../common/cache');
var Course = require('../proxy').Course;
var CourseCollect = require('../proxy').CourseCollect;
var renderHelper = require('../common/render_helper');

exports.create = function (req, res, next) {
  console.log('creating');
  res.render('course/edit', {
    tabs: config.tabs
  });
};

exports.put = function (req, res, next) {
  var courseName = req.param('courseName');
  var teacherName =  req.param('teacherName');

  console.log("课程名:" + courseName);
  console.log("教师名:" + teacherName);

  var proxy = new eventproxy();
  proxy.fail(next);

  Course.getCourseByName(courseName, proxy.done('course'));
  User.getUserByLoginName(teacherName, proxy.done('teacher'));

  proxy.all('course', 'teacher', function(course, teacher) {
    console.log(course, teacher);
    if (course !== null) {
      return res.render('notify/notify', {
        error: '课程已存在'
      });
    } else if (teacher === null) {
      return res.render('notify/notify', {
        error: '用户不存在'
      });
    } else {
      Course.newAndSave(courseName, teacher._id, function (err, course) {
        console.log(course);
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    }
  });
};

exports.index = function (req, res, next) {
  // TODO: filter topics by course
  var cid = req.param('cid');

  var course_id = cid;
  var page = parseInt(req.query.page, 10) || 1;
  page = page > 0 ? page : 1;
  var tab = req.query.tab || 'all';

  var proxy = new eventproxy();
  proxy.fail(next);

  Course.getCourse(cid, proxy.done('course'));

  // 取主题
  var query = {course_id: cid};
  if (tab && tab !== 'all') {
    if (tab === 'good') {
      query.good = true;
    } else {
      query.tab = tab;
    }
  }

  var limit = config.list_topic_count;
  var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

  Topic.getTopicsByQuery(query, options, proxy.done('topics', function (topics) {
    return topics;
  }));

  // 取排行榜上的用户
  cache.get('tops', proxy.done(function (tops) {
    if (tops) {
      proxy.emit('tops', tops);
    } else {
      User.getUsersByQuery(
        {'$or': [
          {is_block: {'$exists': false}},
          {is_block: false}
        ]},
        { limit: 10, sort: '-score'},
        proxy.done('tops', function (tops) {
          cache.set('tops', tops, 60 * 1);
          return tops;
        })
      );
    }
  }));
  // END 取排行榜上的用户

  // 取0回复的主题
  cache.get('no_reply_topics', proxy.done(function (no_reply_topics) {
    if (no_reply_topics) {
      proxy.emit('no_reply_topics', no_reply_topics);
    } else {
      Topic.getTopicsByQuery(
        { reply_count: 0, tab: {$ne: 'job'}},
        { limit: 5, sort: '-create_at'},
        proxy.done('no_reply_topics', function (no_reply_topics) {
          cache.set('no_reply_topics', no_reply_topics, 60 * 1);
          return no_reply_topics;
        }));
    }
  }));
  // END 取0回复的主题

  // 取分页数据
  cache.get('pages', proxy.done(function (pages) {
    if (pages) {
      proxy.emit('pages', pages);
    } else {
      Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
        var pages = Math.ceil(all_topics_count / limit);
        cache.set(JSON.stringify(query) + 'pages', pages, 60 * 1);
        proxy.emit('pages', pages);
      }));
    }
  }));
  // END 取分页数据

  var tabName = renderHelper.tabName(tab);
  proxy.all('course', 'topics', 'tops', 'no_reply_topics', 'pages',
    function (course, topics, tops, no_reply_topics, pages) {
      res.render('course/index', {
        topics: topics,
        current_page: page,
        list_topic_count: limit,
        tops: tops,
        no_reply_topics: no_reply_topics,
        pages: pages,
        tabs: config.tabs,
        tab: tab,
        pageTitle: tabName && (tabName + '版块'),
        cid: cid,
        course: course
      });
    });
};
exports.collect = function (req, res, next) {
  var course_id = req.body.course_id;
  var proxy = new eventproxy();
  proxy.fail(next);
  User.getUserById(req.session.user._id, function (err, user) {
    user.collect_course.push(course_id);
    user.save();
  });
};