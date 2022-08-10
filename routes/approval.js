var express = require('express');
var router = express.Router();
var approval = require('../controllers/Approval');
var auth = require('../controllers/Auth');

/* GET users listing. */

router.get('/transition/:id_tipe_dokumen/:status_dokumen', auth.Auth, approval.getTransition);
router.post('/tujuandisposisi/', auth.Auth, approval.getUserTujuanDisposisi);
router.get('/disposisi/:id_tipe_dokumen/:id_user', auth.Auth, approval.getDisposisi);
router.get('/cetaksertifikat/:policy_id', approval.downloadSertifikat);
router.put('/user/:id_user', auth.Auth, approval.updateStatusUser);
router.put('/akseptasi/:policy_id', auth.Auth, approval.updateStatusAkseptasi);
router.post('/generatekeypg', approval.generateKey);
router.post('/callbackva', approval.callbackVa);

module.exports = router;