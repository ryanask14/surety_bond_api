var request = require('request');
var model = require('../../models/index');
var cabang_model = require('../../models/master_models/cabang');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');

exports.getMasterWilayah = async function (req, res) {
    try
    {
        get_master_wilayah = await cabang_model.getMasterWilayah()
        res.status(200).json({
            status: true,
            data: get_master_wilayah,
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

exports.getAllCabang = async function (req, res) {
    try
    {
        get_all_cabang = await cabang_model.getAllCabang()
        res.status(200).json({
            status: true,
            data: get_all_cabang,
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

exports.getCabangById = async function (req, res) {
    try
    {
        get_cabang_by_id = await cabang_model.getCabangById(req.params.id_cabang)
        res.status(200).json({
            status: true,
            data: get_cabang_by_id,
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

exports.getAllCabangPaging = async function (req, res) {
    try
    {
        get_all_cabang = await cabang_model.getAllCabangPaging(req.params.limit, req.params.offset)
        res.status(200).json({
            status: true,
            data: get_all_cabang,
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

exports.searchCabang = async function (req, res) {
    try
    {
        search_cabang = await cabang_model.searchCabang(req.params.limit, req.params.offset, req.body.idWilayah, req.body.idCabang, req.body.namaCabang)
        res.status(200).json({
            status: true,
            data: search_cabang,
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

exports.updateCabang = async function (req, res) {
    try
    {
        update_cabang = await cabang_model.updateCabang(req.body, req.user.username)
        res.status(200).json({
            status: true,
            message: 'Update data success',
            data: update_cabang,
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