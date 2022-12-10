const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const sectionController = require('../controllers/section/sectionController');
const checkRole = require('../middleware/roleMiddleware')


router.get('/', authMiddleware, sectionController.get);
router.get('/portfolio', authMiddleware, checkRole('user'), sectionController.getPortfolio);

module.exports = router;