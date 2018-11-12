"use strict";

const initSessionSchema = mongoose => {

    const Schema = mongoose.Schema;
    
    const SessionSchema = new Schema({
    
        //  _id: ObjectId,
        nonce: { type: String, default: null },
        complete: { type: Boolean, default: false },
        discord: {
            id: { type: String, default: null },
            access_token: { type: String, default: null },
            token_type: { type: String, default: null },
            expires_in: { type: String, default: null },
            refresh_token: { type: String, default: null },
            scope: { type: String, default: null },
        }
    });
    
    return mongoose.model("Session", SessionSchema);
}

module.exports = initSessionSchema;
