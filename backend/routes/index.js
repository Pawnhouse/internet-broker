const Router = require('express');
const router = new Router();
const personRouter = require('./personRouter');
const requestRouter = require('./requestRoute');
const sectionRouter = require('./sectionRouter');
const stockRouter = require('./stockRouter');
const sharesRouter = require('./sharesRouter');
const commentRouter = require('./commentRouter');
const articleRouter = require('./articleRouter');


router.use('/person', personRouter);
router.use('/request', requestRouter);
router.use('/section', sectionRouter);
router.use('/stock', stockRouter);
router.use('/shares', sharesRouter);
router.use('/comment', commentRouter);
router.use('/article', articleRouter);

module.exports = router;