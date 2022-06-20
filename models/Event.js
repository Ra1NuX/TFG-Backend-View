const {Schema, model} = require('mongoose');
const EventsSchema = new Schema({
    CreatedAt: { type: Date, required: true, default: Date.now },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null, required: true },
    CreatedRoom: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
    Subject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    Title: { type: String, required: true },
    Content: { type: String, required: true },
    EventDate: { type: Date, required: true },
    DeletedAt: { type: Date, default: null },
    LastEdittedAt: { type: Date, default: null },
    LastEdittedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    File: { type: Schema.Types.Buffer } //no
});

module.exports = model('Event', EventsSchema);
