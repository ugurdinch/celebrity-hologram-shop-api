const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res) => {

	// check if user already exists
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length) {
				return res.status(409).json({
					message: 'Email already exists'
				})
			}
			else {
				// password salted hash
				bcrypt.hash(req.body.password, 10, (error, hash) => {
					if (error) {
						return res.status(500).json({
							error: error
						});
					}
					else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash
						});

						user
							.save()
							.then(result => {
								console.log(result);

								res.status(201).json({
									message: "User created"
								});
							})
							.catch(error => {
								console.log(error);

								res.status(500).json({
									error: error
								});
							});
					} // end of else
				});
			} // end of else 
		});
}

exports.user_login = (req, res) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then(user => {
			
			if (user) {
				bcrypt.compare(req.body.password, user.password, (error, result) => {
					if (error) { // error, unseccessful
						return res.status(401).json({
							message: 'Authentication failed'
						});
					}
	
					if (result) { // result == true, successful
	
						const token = jwt.sign(
							{
								userId: user._id,
								email: user.email
							},
							process.env.JWT_KEY,
							{
								expiresIn: "1h"
							}
						);
						return res.status(200).json({
							message: 'Authentication successful',
							token: token
						});
					}
	
					// if the result wasn't successful, then must have failed
					res.status(401).json({
						message: 'Authentication failed'
					});
				});
			}
			else { // user not found, return 401
				res.status(401).json({
					message: 'Authentication failed'
				});
			}
		})
		.catch(error => {
			console.log(error);

			res.status(500).json({
				error: error
			});
		});
}

exports.user_delete = (req, res) => {
	User.remove({ _id: req.params.userId })
		.exec()
		.then(() => {
				res.status(200).json({
					message: 'User deleted'
				});
			})
		.catch(error => {
			console.log(error);

			res.status(500).json({
				error: error
			});
		});
}