var request = require('request');
var model = require('../../models/index');
var akseptasi = require('../../models/akseptasi_models/akseptasi');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');
const e = require('express');
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload_multer = multer({ storage: storage })
module.exports.multer_option = upload_multer.single('fileProyek')

exports.getMasterInquiry = async function (req, res) {
    try
    {
        get_master_inquiry = await akseptasi.getMasterInquiry(req.user)
        res.status(200).json({
            status: true,
            data: get_master_inquiry
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.getDefaultValue = async function (req, res) {
    try
    {
        get_default_value = await akseptasi.getDefaultValue(req.body)
        res.status(200).json({
            status: true,
            data: get_default_value
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.getAllAkseptasi = async function (req, res) {
    try
    {
        let get_all_akseptasi
        if(req.params.id_status)
        {
            if(req.user.role.filter(value => value == 'role_agen').length && req.user.cabang != 'KP')
            {
                get_all_akseptasi = await akseptasi.getAllAkseptasi(req.user.cabang, req.params.id_status, req.user.username)
            }
            else
            {
                get_all_akseptasi = await akseptasi.getAllAkseptasi(req.user.cabang, req.params.id_status)
            }
        }
        else
        {
            if(req.user.role.filter(value => value == 'role_agen').length && req.user.cabang != 'KP')
            {
                get_all_akseptasi = await akseptasi.getAllAkseptasi(req.user.cabang, null, req.user.username)
            }
            else
            {
                get_all_akseptasi = await akseptasi.getAllAkseptasi(req.user.cabang)
            }
        }
        res.status(200).json({
            status: true,
            data: get_all_akseptasi
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.getAkseptasiPaging = async function (req, res) {
    try
    {
        if(req.user.role.filter(value => value == 'role_agen').length && req.user.cabang != 'KP')
        {
            get_akseptasi_paging = await akseptasi.getAkseptasiPaging(req.body, req.params.limit, req.params.offset, req.user.cabang, req.user.username)
        }
        else
        {
            if(req.user.cabang == 'KP' && req.body.idCabang == '')
            {
                get_akseptasi_paging = await akseptasi.getAkseptasiPaging(req.body, req.params.limit, req.params.offset, '')
            }
            else if(req.user.cabang == 'KP' && req.body.idCabang != '')
            {
                get_akseptasi_paging = await akseptasi.getAkseptasiPaging(req.body, req.params.limit, req.params.offset, req.body.idCabang)
            }
            else
            {
                get_akseptasi_paging = await akseptasi.getAkseptasiPaging(req.body, req.params.limit, req.params.offset, req.user.cabang)
            }
        }
        res.status(200).json({
            status: true,
            data: get_akseptasi_paging
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.getAkseptasiById = async function (req, res) {
    try
    {
        get_akseptasi_by_id = await akseptasi.getAkseptasiById(req.params.policy_id)
        res.status(200).json({
            status: true,
            data: get_akseptasi_by_id
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.getMasterInsert = async function (req, res) {
    try
    {
        if(req.params.id_bp)
        {
            get_master_inquiry = await akseptasi.getMasterInsert(req.params.product_id, req.params.id_bp)
        }
        else
        {
            get_master_inquiry = await akseptasi.getMasterInsert(req.params.product_id)
        }
        res.status(200).json({
            status: true,
            data: get_master_inquiry
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.postAkseptasi = async function (req, res) {
    try
    {
        var json_ori = JSON.stringify(req.body).replace(/""|" "/g, "null")
        req.body = JSON.parse(json_ori)
        insertAkseptasi = await akseptasi.insertAkseptasi(req.body, req.user, '', '')
        res.status(200).json({
            status: true,
            message: 'Insert akseptasi success',
            data: {policy_id: insertAkseptasi}
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.searchObligee = async function (req, res) {
    try
    {
        search_bp = await akseptasi.searchBP(req.params.limit, req.params.offset, req.body.partnerTypeId, req.body.name, req.body.npwp, req.body.idNo, req.body.cifNo)
        res.status(200).json({
            status: true,
            data: search_bp,
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.searchPrincipal = async function (req, res) {
    try
    {
        search_bp = await akseptasi.searchBPPrincipal(req.params.limit, req.params.offset, req.body.partnerTypeId, req.body.name, req.body.npwp, req.body.idNo, req.body.cifNo)
        res.status(200).json({
            status: true,
            data: search_bp,
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.insertDocuments = async function (req, res) {
    try
    {
        console.log(req.file)
        insertProyekDoc = await akseptasi.insertProyekDoc(req.file, req.user.username)
        insertProyekDoc.insert_dok_proyek[0][0].jenis_dokumen = req.body.jenis_dokumen
        insertProyekDoc.insert_dok_proyek[0][0].tanggal_dokumen = req.body.tanggal_dokumen
        insertProyekDoc.insert_dok_proyek[0][0].keterangan_dokumen = req.body.keterangan_dokumen
        insertProyekDoc.insert_dok_proyek[0][0].tipe_dokumen = req.body.tipe_dokumen
        insertProyekDoc.insert_dok_proyek[0][0].nomor_dokumen = req.body.nomor_dokumen
        insertProyekDoc.insert_dok_proyek[0][0].tempat = req.body.tempat
        res.status(200).json({
            status: true,
            message: 'Document uploaded successfully',
            data: insertProyekDoc,
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.putAkseptasi = async function (req, res) {
    try
    {
        var json_ori = JSON.stringify(req.body).replace(/""|" "/g, "null")
        req.body = JSON.parse(json_ori)
        putAkseptasi = await akseptasi.updateAkseptasi(req.body, req.user, '', '')
        res.status(200).json({
            status: true,
            message: 'Put akseptasi success',
            data: {policy_id: putAkseptasi}
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.viewDocuments = async function (req, res) {
    try
    {
        viewAkseptasiDoc = await akseptasi.viewAkseptasiDoc(req.params.file_id)
        const download = Buffer.from(viewAkseptasiDoc.view_akseptasi_bp[0].data_file);
            res.setHeader('Content-disposition', 'inline; filename="'+viewAkseptasiDoc.view_akseptasi_bp[0].file_name+'"');
            res.setHeader('Content-type', viewAkseptasiDoc.view_akseptasi_bp[0].file_type);
            res.end(download);
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.schedulerExpiredVa = async function (req, res) {
    try
    {
        await akseptasi.updateSchedulerExpiredVa()
    }
    catch(err)
    {
        console.log(err)
    }
}

exports.getValiditasPolis = async function (req, res) {
    try
    {
        let get_validitas = await akseptasi.getAkseptasiByPolicyId(req.params.policy_id)
        if(!get_validitas.get_policy.length)
        {
            res.status(200).json({
                status: false,
                message: 'Data Akseptasi Not Found'
            })
        }
        else
        {
            res.status(200).json({
                status: true,
                data: get_validitas.get_policy
            })
        }        
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: err
        })
    }
}