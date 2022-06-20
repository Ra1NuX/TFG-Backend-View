const {Schema, model} = require('mongoose');
const CredentialsSchema = new Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    CenterName: { type: String, required: false },
});
module.exports = model('Credentials', CredentialsSchema);
