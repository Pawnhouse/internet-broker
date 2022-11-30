const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const sectionController = require('../controllers/section/sectionController');


router.get('/', authMiddleware, sectionController.get);

module.exports = router;