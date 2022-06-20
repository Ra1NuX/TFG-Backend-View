const {Schema, model} = require('mongoose');
const RoomSchema = new Schema({
    Name: { type: String, required: true },
    MaxUsers: { type: Number, required: true, default:0 },
    AccessKey: { type: String, required: true },
    Users: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
    Subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject', default: null }],
    Messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: null }],
    Events: [{ type: Schema.Types.ObjectId, ref: 'Event', default: null }],
    Bans: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
});
module.exports = model('Room', RoomSchema);
