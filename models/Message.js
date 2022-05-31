const {Schema, model} = require('mongoose');
const MessageSchema = new Schema({
    SendAt: { type: Date, required: true, default: Date.now },
    SendBy: { type: Schema.Types.ObjectId, ref: 'User', default: null, required: true },
    SendInRoom: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
    SendInSubject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    LastEdittedAt: { type: Date, default: null },
    RepyOf: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    Content: { type: String, required: true },
    SawBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
    File: { type: Schema.Types.Buffer }
});
module.exports = model('Message', MessageSchema);
