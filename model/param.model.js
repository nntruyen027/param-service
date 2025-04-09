const mongoose = require('mongoose');

const ParamSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        dataType: {
            type: String,
            enum: ['string', 'number', 'boolean', 'json'],
            required: true,
        },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Param', ParamSchema);
