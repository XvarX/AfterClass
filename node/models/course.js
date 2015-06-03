var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CourseSchema = new Schema({
  name: { type: String },
  course_id: { type: ObjectId},
  author_id: { type: ObjectId},
  create_at: { type: Date, default: Date.now},
  deleted: {type: Boolean, default: false},
  });
CourseSchema.index({course_id: 1, create_at: -1});

mongoose.model('Course', CourseSchema);
