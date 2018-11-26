const mongoose = require('mongoose');

const celebrityHologramSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	description: String,
	image: String,
	contentType: String,
	price: Number,
	quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model('CelebrityHologram', celebrityHologramSchema);