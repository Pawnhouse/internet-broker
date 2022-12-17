const Router = require('express');
const router = new Router();
const articleController = require('../controllers/section/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const roleOrPersonal = require('../middleware/roleOrPersonal');

router.get('/', authMiddleware, articleController.get);
router.post('/write', authMiddleware, roleMiddleware('analyst'), articleController.write);
router.post('/edit-text', authMiddleware, roleOrPersonal(['moderator', 'administrator']), articleController.editText);
router.post('/picture', authMiddleware, roleMiddleware('analyst'), articleController.addPicture);
router.delete('/:id', authMiddleware, roleOrPersonal(['moderator', 'administrator']), articleController.delete);


module.exports = router