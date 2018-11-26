console.log(new Date());

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
const celebrityHologramRoutes = require("./api/routes/celebrity-holograms");
const userRoutes = require("./api/routes/users");

// mongoose
mongoose.connect(`mongodb://node-shop:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-shard-00-00-q3xpm.mongodb.net:27017,cluster0-shard-00-01-q3xpm.mongodb.net:27017,cluster0-shard-00-02-q3xpm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`,
	{
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log('Successfully connected to the database', new Date()))
	.catch(error => console.error('Could not connect to the database', error));

mongoose.Promise = global.Promise;

// logging
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:4200")
	res.header("Access-Control-Allow-Credentials", "true")
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);

	if (req.method === 'OPTIONS') {
		res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
		return res.status(200).json({});
	}
	next();
});

// routes
app.use('/celebrity-holograms', celebrityHologramRoutes);
app.use('/users', userRoutes);

// generate 404
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

// error handling
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		error: {
			message: error.message || "Something went wrong"
		}
	})
});

module.exports = app;