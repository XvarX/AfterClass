var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CourseSchema = new Schema({
  name: { type: String },
  teacher_id: { type: ObjectId},
  teacher_name: { type: String},
  create_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
  collect_user : [Schema.Types.ObjectId],
});

mongoose.model('Course', CourseSchema);
