var express = require('express');
var router = express.Router();
var auth = require('../controllers/Auth');
var master_bp = require('../controllers/master_data/MasterBP');
var master_pks = require('../controllers/master_data/MasterPKS');
var master_cabang = require('../controllers/master_data/MasterCabang');
var master_product = require('../controllers/master_data/MasterProduct');
var master_product_auth = require('../controllers/master_data/MasterProductAuth');
/* GET users listing. */

// BP
router.get('/getbptype/', auth.Auth, master_bp.getMasterBPType);
router.get('/getallbp/', auth.Auth, master_bp.getAllBP);
router.get('/getjenisdokumen/', auth.Auth, master_bp.getJenisDokumen);
router.get('/getallbppaging/:limit/:offset', auth.Auth, master_bp.getAllBPPaging);
router.get('/getbpacsbyid/:bp_id', auth.Auth, master_bp.getBPACSById);
router.get('/getbpbyid/:bp_id', auth.Auth, master_bp.getBPById);
router.get('/getbpdoc/:file_id', auth.Auth, master_bp.viewDocuments);
router.post('/searchbp/:limit/:offset', auth.Auth, master_bp.searchBP);
router.post('/lookupbp/:limit/:offset', auth.Auth, master_bp.lookupBP);
router.post('/syncbp', auth.Auth, master_bp.insertBP);
router.post('/uploadbpdoc', auth.Auth, master_bp.multer_option, master_bp.insertDocuments);
router.delete('/deletebpdoc/:file_id', auth.Auth, master_bp.multer_option, master_bp.deleteDocuments);

//PKS
router.get('/getallpks/', auth.Auth, master_pks.getAllPKS);
router.get('/getpksbyid/:id_pks', auth.Auth, master_pks.getPKSById);
router.post('/searchpks/:limit/:offset', auth.Auth, master_pks.searchPKS);
router.post('/lookuppks/:limit/:offset', auth.Auth, master_pks.lookupPKS);
router.get('/getpksacsbyid/:id_pks', auth.Auth, master_pks.getPKSACSById);
router.post('/syncpks/', auth.Auth, master_pks.syncPKS);

//cabang
router.get('/getwilayah/', auth.Auth, master_cabang.getMasterWilayah);
router.get('/getallcabang/', auth.Auth, master_cabang.getAllCabang);
router.get('/getcabangbyid/:id_cabang', auth.Auth, master_cabang.getCabangById);
router.get('/getallcabangpaging/:limit/:offset', auth.Auth, master_cabang.getAllCabangPaging);
router.post('/searchcabang/:limit/:offset', auth.Auth, master_cabang.searchCabang);
router.put('/updatecabang/', auth.Auth, master_cabang.updateCabang);

//product
router.get('/getgroupproduct/', auth.Auth, master_product.getMasterGroupProduct);
router.get('/getallproduct/', auth.Auth, master_product.getAllProduct);
router.get('/getproductbyid/:product_id', auth.Auth, master_product.getProductById);
router.post('/searchproduct/:limit/:offset', auth.Auth, master_product.searchProduct);
router.post('/insertproduct/', auth.Auth, master_product.insertProduct);
router.put('/updateproduct/:first_product_id', auth.Auth, master_product.updateProduct);

//product auth
router.get('/getproductauthbyid/:id_product_auth', auth.Auth, master_product_auth.getProductAuthById);
router.get('/getmasterproduct/', auth.Auth, master_product_auth.getMasterProduct);
router.get('/getallproductauth/', auth.Auth, master_product_auth.getAllProductAuth);
router.get('/getallproductauthpaging/:limit/:offset', auth.Auth, master_product_auth.getAllProductAuthPaging);
router.post('/searchproductauth/', auth.Auth, master_product_auth.searchProductAuth);
router.post('/insertproductauth/', auth.Auth, master_product_auth.insertProductAuth);
router.put('/updateproductauth/', auth.Auth, master_product_auth.updateProductAuth);

module.exports = router;