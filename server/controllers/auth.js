const { User, Profile } = require('../models/User');
const config = require('../config/index');
const jwt = require('jsonwebtoken');
const cryptoToken = require('crypto-token');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const mongoose = require('mongoose');

/**
 * this controller. confirms the change of a password. and returns a new authentication token to authenticate the user.
 */

exports.confirmPasswordReset = function (req, res) {
	const { email, token, password, passwordV } = req.body;

	User.findOne({ email }, function (err, foundUser) {
		if (err) {
			return res.status(404).send({ errors: [{ title: 'User not found!', title: 'Invalid email address' }] });
		}

		if (foundUser && foundUser.passwordVerificationToken === token) {
			if (password !== passwordV) {
				return res.status(422).send({ errors: [{ title: 'Wrong password', description: 'Passwords do not match.' }] });
			} else {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(password, salt, (err, hash) => {
						if (err) throw err;
						foundUser.password = hash;
						foundUser.save()
							.then(() => {
								console.log(chalk.green('user succesfully changed his password'));
							})
							.catch(err => console.log(chalk.red(err)));
					})
				});

				const authToken = jwt.sign({
					userId: foundUser._id,
					username: foundUser.username,
				}, config.SECRET, { expiresIn: '1h' });

				return res.status(200).json(authToken);
			}
		}
	});
}

/**
 * this controller sends an email to the user where they can be redirected to a form where they can pick a new password.
 */

exports.resetPassword = function (req, res) {
	const { email } = req.body;

	if (email) {

		User.findOne({ email }, function (err, foundUser) {
			if (err) {
				return res.status(202).send({ errors: [{ title: 'user does not exist', description: 'User with that email does not exist.' }] });
			}

			if (foundUser) {

				const token = cryptoToken(50);
				foundUser.passwordVerificationToken = token;

				foundUser.save((err) => {
					if (err) {
						console.log(chalk.red(err));
					} else {
						nodemailer.createTestAccount((err, account) => {
							const htmlEmail = `
                <h1>Email Confirmation</h1>
                <h3>You have requested a password change. If this was not you please disregard this message.</h3>
                <p>Click This link to change your password: <a href="http://localhost:3000/forgotpassword/${token}/${email}">Change Password</a></p>
              `

							const transporter = nodemailer.createTransport({
								host: 'smtp.gmail.com',
								port: 587,
								auth: {
									user: config.GMAIL,
									pass: config.GMAIL_PASSWORD
								}
							});
							const mailOptions = {
								from: 'smediaxp42@gmail.com',
								to: email,
								replyTo: 'smediaxp42@gmail.com',
								subject: 'Change matcha password',
								text: 'Change your matcha password',
								html: htmlEmail
							}

							transporter.sendMail(mailOptions, err => {
								if (err) {
									return res.status(404).send({ errors: [{ title: 'Email was not sent', description: 'Email was not sent. Please try again later.' }] });
								} else {
									console.log(chalk.green('Email has been sent to user reguarding password change'));
									return res.status(200);
								}
							});
						});
					}
				});
			}
		});
	}
}

/**
 * This controller logs a user in by setting a jwt token to the local storage.
 */

exports.login = function (req, res) {
	const { email, password } = req.body;

	if (!password || !email) {
		return res.status(404).send({ errors: [{ title: 'Inclomplete Data', description: 'Provide email and password.' }] });
	}

	User.findOne({ email }, function (err, foundUser) {
		if (err) {
			return res.status(422).send({ errors: [{ title: 'Invalid User!', description: 'Wrong email or password' }] });
		}

		if (foundUser && foundUser.verifiedUser === false) {
			return res.status(422).send({ errors: [{ title: 'User is not verified', description: 'User is not verified, Please check your email address.' }] });
		}

		if (!foundUser) {
			return res.status(404).send({ errors: [{ title: 'User does not exist.', description: 'User with that email does not exist.' }] })
		}

		if (foundUser.hasSamePassword(password)) {

			foundUser.lastOnline = Date.now();
			foundUser.save();
			const token = jwt.sign({
				userId: foundUser._id,
				username: foundUser.username,
			}, config.SECRET, { expiresIn: '1h' });

			return res.status(200).json(token);
		} else {
			return res.status(404).send({ errors: [{ title: 'Wrong password', description: 'Wrong password. Please try again.' }] });
		}
	})
}
/**
 * This controller handles verifying a user and signing them into their account for the first time.
 */
exports.validateLogin = function (req, res) {
	const { email, token } = req.body;

	User.findOne({ email }, function (err, foundUser) {

		if (err) {
			return res.status(404).send({ errors: [{ title: 'error fetching user', description: 'This problem is our fault. Sorry for the inconveniernce' }] });
		}

		if (!foundUser) {
			return res.status(404).send({ errors: [{ title: 'Email not found', description: 'This email is not registered to an account. Please try again.' }] });
		}

		if (foundUser.verifiedUser === true) {
			return res.status(404).send({ errors: [{ description: 'Account already verified.' }] })
		}
		if (foundUser.verifiedUser === false && foundUser.verificationToken === token) {
			foundUser.verifiedUser = true;
			foundUser.verificationToken = '';

			foundUser.save()
				.then(() => {
					let authToken = jwt.sign({
						userId: foundUser.id,
						username: foundUser.username
					}, config.SECRET, { expiresIn: '1h' });
					return res.status(200).json(authToken);
				})
				.catch((err) => {
					console.log(err);
					return res.status(404).send({ errors: [{ title: 'Problem while saving user', description: 'problem saving account details' }] })
				});
		}
	});
}

/**
 * this controller handles signing up a user. And sending an email to confirm their account.
 */

exports.register = function (req, res) {
	const { username, email, password, gender, passwordV, firstName, lastName } = req.body;

	User.findOne({ username }, (err, foundUser) => {
		if (foundUser) {
			return res.status(422).send({ errors: [{ title: 'Username', description: 'This username is taken. Please select another one.' }] });
		} else {

			if (gender === 'Select Gender') {
				return res.status(422).send({ errors: [{ title: 'Please select gender', description: 'Please select your gender.' }] });
			} else if (password !== passwordV) {
				return res.status(422).send({ errors: [{ title: 'Invalid Password', description: 'Passwords do not match!' }] });
			} else {
				const token = cryptoToken(30);
				User.findOne({ email }, function (err, existingUser) {
					if (err) {
						return res.status(422).json(err);
					}

					if (existingUser) {
						return res.status(422).send({ errors: [{ title: 'Invalid Email!', description: 'User with that email already exists.' }] });
					}

					const newUser = new User({
						username,
						email,
						password,
						verificationToken: token
					});

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;

							/**
							 * Ivan i found not better way to save the users profile inside the user schema so if you know a more efficient way,
							 * then feel free to change this. I dont know if having a nested save() is a safe thing to do, but it works lol
							 */
							const newProfile = new Profile({
								profileId: mongoose.Types.ObjectId(newUser._id),
								firstName,
								lastName,
								gender,
								username,
							});

							newProfile.save()
								.then(returnedUser => {
									newUser.profile = returnedUser._id;

									newUser.save()
										.then(() => {
											// Send email to user to confirm their account
											nodemailer.createTestAccount((err, account) => {
												const htmlEmail = `
										<h1>Email Confirmation</h1>
										<h3>Thanks for creating a Matcha account ${username}. Please click the link below to verify your account.</h3>
										<p>Click This link to confirm your account: <a href="http://localhost:3000/validatelogin/${email}/${token}">Confirm Account</a></p>
									`;

												const transporter = nodemailer.createTransport({
													host: 'smtp.gmail.com',
													port: 587,
													auth: {
														user: config.GMAIL,
														pass: config.GMAIL_PASSWORD
													}
												});
												const mailOptions = {
													from: 'smediaxp42@gmail.com',
													to: req.body.email,
													replyTo: 'smediaxp42@gmail.com',
													subject: 'Confirm Matcha Account',
													text: 'Please verify email address.',
													html: htmlEmail
												}

												transporter.sendMail(mailOptions, err => {
													if (err) {
														return res.status(404).send({ errors: [{ title: 'Could not send verification email', description: 'Could not send verification email' }] });
													} else {
														return res.status(200).send();
													}
												});
											});
											console.log(chalk.blue('New User created and save with profile.'));
										})
										.catch(err => {
											console.log(err);
										})
								})
								.catch(err => {
									console.log(errors);
								});
						});
					});
				});
			}
		}
	});
}