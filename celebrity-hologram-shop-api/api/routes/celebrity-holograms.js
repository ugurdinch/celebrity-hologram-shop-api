const express = require("express");
const router = express.Router();
const checkAuthentication = require('../middleware/check-authentication');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});

// accept only jpeg and png
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
	else cb(new Error, false);
}

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

const CelebrityHologramsController = require('../controllers/celebrity-holograms');

router.get('/', checkAuthentication, CelebrityHologramsController.celebrity_holograms_get_all);

router.post('/', checkAuthentication, upload.single('image'), CelebrityHologramsController.celebrity_holograms_create_celebrity_hologram);

router.get('/:celebrityHologramId', checkAuthentication, CelebrityHologramsController.celebrity_holograms_get_celebrity_hologram);

router.delete('/:celebrityHologramId', checkAuthentication, CelebrityHologramsController.celebrity_holograms_delete_celebrity_hologram);

module.exports = router;