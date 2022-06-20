const {Schema, model} = require('mongoose');
const MessageSchema = new Schema({
    SendAt: { type: Date, required: true, default: Date.now },
    SendBy: { type: Schema.Types.ObjectId, ref: 'User', default: null, required: true },
    SendInRoom: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
    SendInSubject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    Content: { type: String, required: true },
    FirebaseRef: { type: String, required: true },
    UserName: { type: String, required: true },
    DeletedAt: { type: Date, default: null },
    LastEdittedAt: { type: Date, default: null }, //no lo voy a hacer
    RepyOf: { type: Schema.Types.ObjectId, ref: 'Message', default: null }, // 
    SawBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }], // 
    File: { type: Schema.Types.Buffer } // 
});
module.exports = model('Message', MessageSchema);
