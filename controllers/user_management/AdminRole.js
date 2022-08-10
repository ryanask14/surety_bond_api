var request = require('request');
var model = require('../../models/index');
var role_model = require('../../models/admin_models/role');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');

exports.postSearchRole = async function (req, res) {
    try
    {
        search_role = await role_model.postSearchRole(req.params.limit, req.params.offset, req.body.roleName)
        res.status(200).json({
            status: true,
            data: search_role.role_data,
            data_count: search_role.count_data.data_count
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

exports.getAllRole = async function (req, res) {
    try
    {
        all_role = await role_model.getAllRole()
        res.status(200).json({
            status: true,
            data: all_role.role_data,
            data_count: all_role.count_data.data_count
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

exports.getRoleByName = async function (req, res) {
    try
    {
        role_by_name = await role_model.getRoleByName(req.params.role_name)
        res.status(200).json({
            status: true,
            data: role_by_name.role_data
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

exports.postInsertRole = async function (req, res) {
    try
    {
        insert_role = await role_model.postInsertRole(req.body.roleName, req.body.keterangan, req.user.username, req.body.isActive)
        if(insert_role.role_data)
        {
            res.status(200).json({
                status: true,
                message: 'Insert role success',
                data: insert_role.role_data
            })
        }
        else
        {
            res.status(400).json({
                status: false,
                message: "Role name is already exist"
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

exports.putUpdateRole = async function (req, res) {
    try
    {
        update_role = await role_model.putUpdateRole(req.body.roleName, req.body.keterangan, req.user.username, req.body.isActive, req.params.role_name)
        if(update_role.role_data)
        {
            res.status(200).json({
                status: true,
                message: 'Update role success',
                data: update_role.role_data
            })
        }
        else
        {
            res.status(400).json({
                status: false,
                message: "Role name is already exist"
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