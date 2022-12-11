const Router = require('express');
const router = new Router();
const articleController = require('../controllers/section/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, articleController.get);
router.post('/create', authMiddleware, roleMiddleware('analyst'), articleController.create);


module.exports = router