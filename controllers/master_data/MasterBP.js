var request = require('request');
var model = require('../../models/index');
var bp_model = require('../../models/master_models/bp');
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
module.exports.multer_option = upload_multer.single('fileBP')

exports.getMasterBPType = async function (req, res) {
    try
    {
        get_master_bp = await bp_model.getMasterBPType()
        res.status(200).json({
            status: true,
            data: get_master_bp,
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

exports.getAllBP = async function (req, res) {
    try
    {
        get_all_bp = await bp_model.getAllBP()
        res.status(200).json({
            status: true,
            data: get_all_bp,
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

exports.getAllBPPaging = async function (req, res) {
    try
    {
        get_all_bp = await bp_model.getAllBPPaging(req.params.limit, req.params.offset)
        res.status(200).json({
            status: true,
            data: get_all_bp,
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

exports.getJenisDokumen = async function (req, res) {
    try
    {
        jenis_dokumen_bp = await bp_model.getJenisDokumen()
        res.status(200).json({
            status: true,
            data: jenis_dokumen_bp,
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

exports.searchBP = async function (req, res) {
    try
    {
        search_bp = await bp_model.searchBP(req.params.limit, req.params.offset, req.body.partnerTypeId, req.body.name, req.body.npwp, req.body.idNo, req.body.cifNo)
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

exports.lookupBP = async function (req, res) {
    try
    {
        lookup_bp = await bp_model.lookupBP(req.params.limit, req.params.offset, req.body.partnerTypeId, req.body.name, req.body.npwp, req.body.idNo, req.body.cifNo)
        for(let i = 0; i<lookup_bp.lookup_bp.length; i++)
        {
            if(lookup_bp.lookup_bp[i].is_active == '1')
            {
                lookup_bp.lookup_bp[i].is_active = true
            }
            else
            {
                lookup_bp.lookup_bp[i].is_active = false
            }
        }
        res.status(200).json({
            status: true,
            data: lookup_bp,
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

exports.getBPACSById = async function (req, res) {
    try
    {
        get_bp_acs_by_id = await bp_model.getBPACSById(req.params.bp_id)

        for(let i = 0; i<get_bp_acs_by_id.data_bp.length; i++)
        {
            if(get_bp_acs_by_id.data_bp[i].is_active == '1')
            {
                get_bp_acs_by_id.data_bp[i].is_active = true
            }
            else
            {
                get_bp_acs_by_id.data_bp[i].is_active = false
            }
        }

        for(let i = 0; i<get_bp_acs_by_id.data_pks.length; i++)
        {
            if(get_bp_acs_by_id.data_pks[i].is_active == '1')
            {
                get_bp_acs_by_id.data_pks[i].is_active = true
            }
            else
            {
                get_bp_acs_by_id.data_pks[i].is_active = false
            }
        }
        res.status(200).json({
            status: true,
            data: get_bp_acs_by_id,
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

exports.getBPById = async function (req, res) {
    try
    {
        get_bp_acs_by_id = await bp_model.getBPById(req.params.bp_id)

        // for(let i = 0; i<get_bp_acs_by_id.data_bp.length; i++)
        // {
        //     if(get_bp_acs_by_id.data_bp[i].is_active == true)
        //     {
        //         get_bp_acs_by_id.data_bp[i].is_active = true
        //     }
        //     else
        //     {
        //         get_bp_acs_by_id.data_bp[i].is_active = false
        //     }
        // }

        // for(let i = 0; i<get_bp_acs_by_id.data_pks.length; i++)
        // {
        //     if(get_bp_acs_by_id.data_pks[i].is_active == true)
        //     {
        //         get_bp_acs_by_id.data_pks[i].is_active = true
        //     }
        //     else
        //     {
        //         get_bp_acs_by_id.data_pks[i].is_active = false
        //     }
        // }
        res.status(200).json({
            status: true,
            data: get_bp_acs_by_id,
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

exports.insertBP = async function (req, res) {
    try
    {
        insertBP = await bp_model.insertBP(req.body, req.user.username)
        if(insertBP.data_bp == false)
        {
            res.status(200).json({
                status: true,
                message: 'BP and PKS are already synchronized',
                data: false,
            })
        }
        else
        {
            res.status(200).json({
                status: true,
                message:'Insert/update data success',
                data: insertBP,
            })
        }
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
        console.log(req.body)

        insertBPDoc = await bp_model.insertBPDoc(req.file, req.user.username)
        insertBPDoc.insert_dok_bp[0][0].jenis_dokumen = req.body.jenis_dokumen
        insertBPDoc.insert_dok_bp[0][0].tanggal_kadaluarsa = req.body.tanggal_kadaluarsa
        insertBPDoc.insert_dok_bp[0][0].keterangan_dokumen = req.body.keterangan_dokumen
        res.status(200).json({
            status: true,
            message: 'Document uploaded successfully',
            data: insertBPDoc,
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
        viewBPDoc = await bp_model.viewBPDoc(req.params.file_id)
        const download = Buffer.from(viewBPDoc.view_dok_bp[0].data_file);
            res.setHeader('Content-disposition', 'inline; filename="'+viewBPDoc.view_dok_bp[0].file_name+'"');
            res.setHeader('Content-type', viewBPDoc.view_dok_bp[0].file_type);
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

exports.deleteDocuments = async function (req, res) {
    try
    {
        deleteBPDoc = await bp_model.deleteBPDoc(req.params.file_id, req.user.username)
        res.status(200).json({
            status: true,
            message: 'Document deleted successfully',
            data: deleteBPDoc,
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