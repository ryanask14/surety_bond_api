var express = require('express');
var router = express.Router();
var login = require('../controllers/Login');
var admin_user = require('../controllers/user_management/AdminUser');
var auth = require('../controllers/Auth');

/* GET users listing. */

router.post('/login', login.Auth);
router.post('/forgetpassword', login.forgetPassword);
router.post('/changepassword', login.changePassword);
router.put('/updatepassword/:id_user',auth.Auth, login.putPassword);
router.get('/getnotifications/:id_user', login.getNotifications);
router.get('/logout', login.Logout);

module.exports = router;
