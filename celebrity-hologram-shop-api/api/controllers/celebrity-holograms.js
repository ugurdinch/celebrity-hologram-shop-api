const mongoose = require('mongoose');
const CelebrityHologram = require('../models/celebrity-hologram');

exports.celebrity_holograms_get_all = (req, res, next) => {
	CelebrityHologram.find()
		.select('_id name description image price quantity')
		.exec()
		.then(docs => {
			// console.log(docs);

			res.status(200).json({
				count: docs.length,
				celebrityHolograms: docs.map(doc => {
					return {
						_id: doc._id,
						name: doc.name,
						description: doc.description,
						image: doc.image,
						contentType: doc.contentType,
						price: doc.price,
						quantity: doc.quantity,
						request: {
							type: "GET",
							description: `Returns celebrity hologram ${doc._id}`,
							url: `http://localhost:3000/celebrity-holograms/${doc._id}`
						}
					}
				})
			});
		})
		.catch(error => {
			console.log(error);

			res.status(500).json({
				error: error
			});
		});
}

exports.celebrity_holograms_create_celebrity_hologram = (req, res, next) => {
	console.log(req.file);

	const celebrityHologram = new CelebrityHologram({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		contentType: req.body.contentType,
		price: req.body.price,
		quantity: req.body.quantity,
	});

	celebrityHologram
		.save()
		.then(result => {
			// console.log(result);

			res.status(201).json({
				message: 'Celebrity hologram is successfully created',
				createdCelebrityHologram: {
					_id: result._id,
					name: result.name,
					description: result.description,
					image: result.image,
					contentType: result.contentType,
					price: result.price,
					quantity: result.quantity,
				},
				request: {
					type: "GET",
					description: `Returns celebrity hologram ${result._id}`,
					url: `http://localhost:3000/celebrity-holograms/${result._id}`
				}
			});

		})
		.catch(error => {
			// console.log(error);

			res.status(500).json({
				error: error
			});
		});

}

exports.celebrity_holograms_get_celebrity_hologram = (req, res, next) => {
	const celebrityHologramId = req.params.celebrityHologramId;

	CelebrityHologram.findById(celebrityHologramId)
		.exec()
		.then(doc => {
			// console.log(doc);
			if (doc) {
				res.status(200).json({
					_id: doc._id,
					name: doc.name,
					description: doc.description,
					image: doc.image,
					contentType: doc.contentType,
					price: doc.price,
					quantity: doc.quantity,
					request: {
						type: "GET",
						description: "Returns all celebrity holograms",
						url: `http://localhost:3000/celebrity-holograms`
					}
				});
			}
			else {
				res.status(404).json({
					message: `Celebrity hologram ${celebrityHologramId} not found`
				})
			}
		})
		.catch(error => {
			// console.log(error);

			res.status(500).json({
				error: error
			});
		});

}

exports.celebrity_holograms_delete_celebrity_hologram = (req, res, next) => {
	const celebrityHologramId = req.params.celebrityHologramId;

	CelebrityHologram.remove({ _id: celebrityHologramId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Celebrity hologram deleted',
				request: {
					type: "POST",
					description: "Creates a new celebrity hologram",
					url: `http://localhost:3000/celebrity-holograms`,
					body: { name: "String", description: "String", image: "String", contentType: "String", price: "Number", quantity: "Number" }
				}
			});
		})
		.catch(error => {
			// console.log(error);

			res.status(500).json({
				error: error
			});
		});

}