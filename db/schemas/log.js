"use strict";

const initLogSchema = mongoose => {

    const Schema = mongoose.Schema;
    
    const LogSchema = new Schema({
    
        //  _id: ObjectId,
        type: { type: String, required: true },
        message: { type: String, required: true },
        time: { type: Date, default: Date.now }
    });
    
    return mongoose.model("Log", LogSchema);
}

module.exports = initLogSchema;
