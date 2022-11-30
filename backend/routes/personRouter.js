const Router = require('express');
const router = new Router();
const personController = require('../controllers/personController');
const authMiddleware = require('../middleware/authMiddleware');
const roleOrPersonal = require('../middleware/roleOrPersonal');

router.get('/auth', authMiddleware, personController.check);
router.get('/user-data', authMiddleware, personController.getSimpleUserData);
router.post('/login', personController.login);
router.post('/register', personController.register);
router.post('/deposit', authMiddleware, personController.deposit);
router.post('/withdrawal', authMiddleware, personController.withdrawal);
router.patch('/', roleOrPersonal(['administrator']), personController.updateUser);
router.post('/', personController.updateUser);
router.patch('/picture', personController.addPicture);


module.exports = router