const {Schema, model} = require('mongoose');
const SubjectSchema = new Schema({
   Name: { type: String, required: true },
   Code: { type: String, required: true },
});
module.exports = model('Subject', SubjectSchema);
