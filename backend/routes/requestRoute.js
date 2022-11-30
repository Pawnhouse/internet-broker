const Router = require('express');
const router = new Router();
const requestController = require('../controllers/requestController');
const roleOrPersonal = require('../middleware/roleOrPersonal');
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, requestController.create);
router.get('/', roleOrPersonal(['administrator']), requestController.get);
router.post('/dismiss', checkRole('administrator'), requestController.dismiss);
router.post('/approve', checkRole('administrator'), requestController.approve);


module.exports = router;