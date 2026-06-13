const express       = require('express');
const router        = express.Router();
const requireAdminAuth = require('../middleware/requireAdminAuth');
const {
  getStats,
  getVisitors,
  getVisitorBreakdown,
  getUsers,
  getLinks,
} = require('../controller/AdminController');

// Every admin route requires Basic Auth
router.use(requireAdminAuth);

router.get('/stats',             getStats);
router.get('/visitors',          getVisitors);
router.get('/visitors/breakdown', getVisitorBreakdown);
router.get('/users',             getUsers);
router.get('/links',             getLinks);

module.exports = router;
