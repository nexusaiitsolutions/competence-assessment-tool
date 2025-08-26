const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/usersController');


const router = express.Router();


router.get('/me', authenticateToken, ctrl.me);
router.get('/', authenticateToken, authorize(['admin','hr','manager','leader']), ctrl.list);
router.post('/', authenticateToken, authorize(['admin','hr']), ctrl.create);
router.put('/:id', authenticateToken, authorize(['admin','hr']), ctrl.update);


module.exports = router;