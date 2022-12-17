const Router = require('express');
const router = new Router();
const personController = require('../controllers/personController');
const authMiddleware = require('../middleware/authMiddleware');
const roleOrPersonal = require('../middleware/roleOrPersonal');

router.get('/auth', authMiddleware, personController.check);
router.get('/user-data', authMiddleware, personController.getSimpleUserData);
router.get('/company', authMiddleware, personController.getCompany);
router.get('/check-deposit', authMiddleware, personController.checkDeposit);
router.get('/:id', authMiddleware, roleOrPersonal(['administrator']), personController.getUser);

router.post('/login', personController.login);
router.post('/one-time', personController.loginOneTimePassword);
router.post('/register', personController.register);
router.post('/deposit', authMiddleware, personController.deposit);
router.post('/withdrawal', authMiddleware, personController.withdrawal);

router.post('/', personController.updateUser);
router.post('/company', authMiddleware, personController.setCompany);
router.patch('/', roleOrPersonal(['administrator']), personController.updateUser);
router.patch('/picture', personController.addPicture);

module.exports = router