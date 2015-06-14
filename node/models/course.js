var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CourseSchema = new Schema({
  name: { type: String },
  teacher_id: { type: ObjectId},
  create_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

mongoose.model('Course', CourseSchema);
