const Router = require('express');
const router = new Router();
const personRouter = require('./personRouter');
const requestRouter = require('./requestRoute');
const sectionRouter = require('./sectionRouter');
const stockRouter = require('./stockRouter');
const sharesRouter = require('./sharesRouter');


router.use('/person', personRouter);
router.use('/request', requestRouter);
router.use('/section', sectionRouter);
router.use('/stock', stockRouter);
router.use('/shares', sharesRouter);

module.exports = router;