var express = require('express');
var router = express.Router();
var akseptasi = require('../controllers/akseptasi/Akseptasi');
var reporting = require('../controllers/akseptasi/Reporting');
var auth = require('../controllers/Auth');

/* GET users listing. */

router.get('/masterinquiry', auth.Auth, akseptasi.getMasterInquiry);
router.get('/masterinsert/:product_id/:id_bp', auth.Auth, akseptasi.getMasterInsert);
router.get('/masterinsert/:product_id/', auth.Auth, akseptasi.getMasterInsert);
router.get('/allakseptasi/:id_status', auth.Auth, akseptasi.getAllAkseptasi);
router.get('/allakseptasi/', auth.Auth, akseptasi.getAllAkseptasi);
router.post('/akseptasipaging/:limit/:offset', auth.Auth, akseptasi.getAkseptasiPaging);
router.post('/obligee/:limit/:offset', auth.Auth, akseptasi.searchObligee);
router.post('/principal/:limit/:offset', auth.Auth, akseptasi.searchPrincipal);
router.get('/akseptasibyid/:policy_id', auth.Auth, akseptasi.getAkseptasiById);
router.post('/', auth.Auth, akseptasi.postAkseptasi);
router.put('/', auth.Auth, akseptasi.putAkseptasi);
router.post('/getdefaultvalue', auth.Auth, akseptasi.getDefaultValue);
router.post('/insertdokumenproyek', auth.Auth, akseptasi.multer_option, akseptasi.insertDocuments);
router.get('/getakseptasidoc/:file_id', auth.Auth, akseptasi.viewDocuments);
router.get('/cek/:policy_id', akseptasi.getValiditasPolis);
router.get('/report', /*auth.Auth,*/ reporting.generateExcel);

module.exports = router;