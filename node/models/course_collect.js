var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CourseCollectSchema = new Schema({
  user_id: { type: ObjectId },
  course_id: { type: ObjectId },
  create_at: { type: Date, default: Date.now }
});

mongoose.model('CourseCollect', CourseCollectSchema);
