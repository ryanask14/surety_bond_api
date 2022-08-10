var request = require('request');
var model = require('../../models/index');
var product_auth_model = require('../../models/master_models/productauth');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');

exports.getMasterProduct = async function (req, res) {
    try
    {
        master_product = await product_auth_model.getMasterProduct()
        res.status(200).json({
            status: true,
            data: master_product,
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

exports.getAllProductAuth = async function (req, res) {
    try
    {
        let all_product_auth = await product_auth_model.getAllProductAuth()
        res.status(200).json({
            status: true,
            data: all_product_auth,
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

exports.getAllProductAuthPaging = async function (req, res) {
    try
    {
        let all_product_auth = await product_auth_model.getAllProductAuthPaging(req.params.limit, req.params.offset)
        res.status(200).json({
            status: true,
            data: all_product_auth,
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

exports.searchProductAuth = async function (req, res) {
    try
    {
        search_product_auth = await product_auth_model.searchProductAuth(req.body)
        res.status(200).json({
            status: true,
            data: search_product_auth,
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

exports.getProductAuthById = async function (req, res) {
    try
    {
        let search_product = await product_auth_model.getProductAuthById(req.params.id_product_auth)
        res.status(200).json({
            status: true,
            data: search_product,
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

exports.insertProductAuth = async function (req, res) {
    try
    {
        insert_product_auth = await product_auth_model.insertProductAuth(req.body, req.user.username)
        res.status(200).json({
            status: true,
            message: 'Insert data success',
            data: insert_product_auth,
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

// exports.insertProductAuth = async function (req, res) {
//     try
//     {
//         insert_product_auth = await product_auth_model.insertProductAuth(req.body, req.user.username)
//         res.status(200).json({
//             status: true,
//             message: 'Insert data success',
//             data: insert_product_auth,
//         })
//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(400).json({
//             status: false,
//             message: err.message
//         })
//     }
// }

exports.updateProductAuth = async function (req, res) {
    try
    {
        update_product_auth = await product_auth_model.updateProductAuth(req.body, req.user.username)
        res.status(200).json({
            status: true,
            message: 'Update data success',
            data: update_product_auth,
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