const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    FirebaseRef: { type: String, required: true },
    Username: { type: String, required: true },
    Name: { type: String, required: false },
    Surname: { type: String, required: false },
    Birthdate: { type: Date, required: false },
    Phone: { type: String, required: false },
    Email: { type: String, required: true },
    Avatar: { type: String, required: false },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    DeletedAt: { type: Date, default: null },
    Messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: null }],
});

module.exports = model('User', UserSchema);