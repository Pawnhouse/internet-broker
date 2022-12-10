const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const sharesController = require('../controllers/section/sharesController');
const sectionController = require('../controllers/section/sectionController');

router.get('/', authMiddleware, sharesController.get);
router.get('/candles', authMiddleware, sharesController.getCandles);
router.post('/buy', authMiddleware, checkRole('user'), sharesController.buy);
router.post('/sell', authMiddleware, checkRole('user'), sharesController.sell);
router.get('/count', authMiddleware, sharesController.getCount);
router.put('/', checkRole('administrator'), sharesController.put);
router.patch('/disable', checkRole('administrator'), sectionController.activation(false, 'shares'));
router.patch('/enable', checkRole('administrator'), sectionController.activation(true, 'shares'));

module.exports = router;