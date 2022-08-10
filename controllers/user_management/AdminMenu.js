var request = require('request');
var model = require('../../models/index');
var role_model = require('../../models/admin_models/menu');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');

sortMenu = function (list) {
    var map = {}, node,  roots = [];
  
    for (let i = 0; i < list.length; i++) {
        map[list[i].id_menu] = i; // initialize the map
        list[i].children = []; // initialize the children
    }
    
    for (let i = 0; i < list.length; i++) {

        node = list[i];
        if (node.parent_id) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parent_id]].children.push(node);
            console.log(list[map[node.parent_id]])
        } else {
            roots.push(node);
        }
    }
    return roots;
}

exports.getModuleMaster = async function (req, res) {
    try
    {
        get_lookup = await role_model.getModuleName()
        get_parent = await role_model.getParentName()
        res.status(200).json({
            status: true,
            data_lookup: get_lookup.menu_data,
            data_parent: get_parent.menu_data
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

exports.getAllMenu = async function (req, res) {
    try
    {
        get_all_menu = await role_model.getAllMenu()
        get_all_menu.menu_data = sortMenu(get_all_menu.menu_data)
        res.status(200).json({
            status: true,
            data_menu: get_all_menu.menu_data,
            data_count: get_all_menu.count_data,
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

exports.getMenuById = async function (req, res) {
    try
    {
        get_menu_by_id = await role_model.getMenuById(req.params.id_menu)
        
        res.status(200).json({
            status: true,
            data_menu: get_menu_by_id.menu_data,
            data_count: get_menu_by_id.count_data,
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

exports.postMenuSearch = async function (req, res) {
    try
    {
        get_menu_search = await role_model.getMenuSearch(req.body)
        
        res.status(200).json({
            status: true,
            data_menu: get_menu_search.menu_data,
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

exports.postMenu = async function (req, res) {
    try
    {
        var json_ori = JSON.stringify(req.body).replace(/""|"null"|" "/g, "null")
        var body = JSON.parse(json_ori);
        console.log(body)
        insert_menu = await role_model.postMenu(body, req.user.username)
        
        res.status(200).json({
            status: true,
            message: 'Insert menu success',
            data_menu: insert_menu.menu_data,
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

exports.putMenu = async function (req, res) {
    try
    {
        var json_ori = JSON.stringify(req.body).replace(/""|"null"|" "/g, "null")
        var body = JSON.parse(json_ori);
        update_menu = await role_model.putMenu(body, req.user.username)
        
        res.status(200).json({
            status: true,
            message: 'Update menu success',
            data_menu: update_menu.menu_data,
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