const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const stockController = require('../controllers/section/stockController');
const sectionController = require('../controllers/section/sectionController');

router.get('/', authMiddleware, stockController.get);
router.get('/count', authMiddleware, stockController.getCount);
router.get('/candles', authMiddleware, stockController.getCandles);
router.post('/buy', authMiddleware, checkRole('user'), stockController.buy);
router.post('/sell', authMiddleware, checkRole('user'), stockController.sell);
router.put('/', checkRole('administrator'), stockController.put);
router.patch('/disable', checkRole('administrator'), sectionController.activation(false, 'stock'));
router.patch('/enable', checkRole('administrator'), sectionController.activation(true, 'stock'));

module.exports = router;