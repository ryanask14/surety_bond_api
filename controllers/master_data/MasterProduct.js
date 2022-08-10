var request = require('request');
var model = require('../../models/index');
var product_model = require('../../models/master_models/product');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');

exports.getMasterGroupProduct = async function (req, res) {
    try
    {
        group_product_master = await product_model.getMasterGroupProduct()
        res.status(200).json({
            status: true,
            data: group_product_master,
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

exports.getAllProduct = async function (req, res) {
    try
    {
        all_product = await product_model.getAllProduct()
        res.status(200).json({
            status: true,
            data: all_product,
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

exports.getProductById = async function (req, res) {
    try
    {
        product_by_id = await product_model.getProductById(req.params.product_id)
        res.status(200).json({
            status: true,
            data: product_by_id,
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

exports.searchProduct = async function (req, res) {
    try
    {
        search_product = await product_model.searchProduct(req.params.limit, req.params.offset, req.body.name, req.body.productId)
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

exports.insertProduct = async function (req, res) {
    try
    {
        insert_product = await product_model.insertProduct(req.body, req.user.username)
        res.status(200).json({
            status: true,
            message: "Insert data success",
            data: insert_product,
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

exports.updateProduct = async function (req, res) {
    try
    {
        update_product = await product_model.updateProduct(req.body, req.params.first_product_id, req.user.username)
        res.status(200).json({
            status: true,
            message: "Update data success",
            data: update_product,
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