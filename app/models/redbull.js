const mongoose = require('mongoose')

const redbullSchema = new mongoose.Schema(
	{
		flavor: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Redbull', redbullSchema)