const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleOrPersonal = require('../middleware/roleOrPersonal');

router.get('/', authMiddleware, commentController.get);
router.post('/create', authMiddleware, commentController.create);
router.delete(
  '/:id',
  authMiddleware,
  roleOrPersonal(['administrator', 'moderator']),
  commentController.delete
);

module.exports = router