var express = require('express');
var router = express.Router();
var auth = require('../controllers/Auth');
var admin_user = require('../controllers/user_management/AdminUser');
var admin_user_principal = require('../controllers/user_management/AdminUserPrincipal');
var admin_role = require('../controllers/user_management/AdminRole');
var admin_menu = require('../controllers/user_management/AdminMenu');
var admin_group_menu = require('../controllers/user_management/AdminGroupMenu');

/* GET users listing. */

// user
router.post('/searchuser/:limit/:offset', auth.Auth, admin_user.postSearchUser);
router.post('/registeruser', auth.Auth, admin_user.registerUser);
router.put('/updateuser', auth.Auth, admin_user.putUser);
router.get('/alluser', auth.Auth, admin_user.getAllUser);
router.get('/userbyid/:id_user', auth.Auth, admin_user.getUserById);
router.get('/allmaster', auth.Auth, admin_user.getAllMaster);
router.post('/searchagen/:limit/:offset', auth.Auth, admin_user.postSearchAgen);
router.get('/allagen', auth.Auth, admin_user.getAllAgen);

// user principal
// router.post('/searchuser/:limit/:offset', auth.Auth, admin_user.postSearchUser);
// router.post('/registeruser', auth.Auth, admin_user.registerUser);
// router.put('/updateuser', auth.Auth, admin_user.putUser);
// router.get('/alluser', auth.Auth, admin_user.getAllUser);
// router.get('/userbyid/:id_user', auth.Auth, admin_user.getUserById);
router.get('/masterprincipal', auth.Auth, admin_user_principal.getMasterData);
router.get('/zipcode/:zip_code', auth.Auth, admin_user_principal.getKodePos);
// router.post('/searchagen/:limit/:offset', auth.Auth, admin_user.postSearchAgen);
// router.get('/allagen', auth.Auth, admin_user.getAllAgen);

// role
router.post('/searchrole/:limit/:offset', auth.Auth, admin_role.postSearchRole);
router.get('/allrole', auth.Auth, admin_role.getAllRole);
router.get('/role/:role_name', auth.Auth, admin_role.getRoleByName);
router.post('/role', auth.Auth, admin_role.postInsertRole);
router.put('/role/:role_name', auth.Auth, admin_role.putUpdateRole);

// menu
router.get('/menumodule', auth.Auth, admin_menu.getModuleMaster);
router.get('/allmenu', auth.Auth, admin_menu.getAllMenu);
router.get('/menu/:id_menu', auth.Auth, admin_menu.getMenuById);
router.post('/searchmenu', auth.Auth, admin_menu.postMenuSearch);
router.post('/menu', auth.Auth, admin_menu.postMenu);
router.put('/menu', auth.Auth, admin_menu.putMenu);

// group menu

router.get('/allgroupmenu', auth.Auth, admin_group_menu.getAllGroupMenu);
router.get('/groupmenu/:id_group_menu', auth.Auth, admin_group_menu.getGroupMenuById);
router.post('/searchgroupmenu', auth.Auth, admin_group_menu.getSearchGroupMenu);
router.post('/groupmenu', auth.Auth, admin_group_menu.postGroupMenu);
router.put('/groupmenu', auth.Auth, admin_group_menu.putGroupMenu);

module.exports = router;
