var request = require('request');
var model = require('../../models/index');
var role_model = require('../../models/admin_models/groupmenu');
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

exports.getAllGroupMenu = async function (req, res) {
    try
    {
        get_all_group_menu = await role_model.getAllGroupMenu()
        res.status(200).json({
            status: true,
            data_group_menu: get_all_group_menu.group_menu_data
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

exports.getGroupMenuById = async function (req, res) {
    try
    {
        get_group_menu_by_id = await role_model.getGroupMenuById(req.params.id_group_menu)
        get_group_menu_by_id.menu_data = sortMenu(get_group_menu_by_id.menu_data)
        res.status(200).json({
            status: true,
            data_group_menu: get_group_menu_by_id.group_menu_data,
            data_menu: get_group_menu_by_id.menu_data
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

exports.getSearchGroupMenu = async function (req, res) {
    try
    {
        get_search_group_menu = await role_model.getSearchGroupMenu(req.body)
        res.status(200).json({
            status: true,
            data_group_menu: get_search_group_menu.group_menu_data,
            data_count: get_search_group_menu.data_count[0].data_count
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

exports.postGroupMenu = async function (req, res) {
    try
    {
        insert_group_menu = await role_model.postGroupMenu(req.body, req.user.username)
        res.status(200).json({
            status: true,
            data_group_menu: insert_group_menu.group_menu_data
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

exports.putGroupMenu = async function (req, res) {
    try
    {
        update_group_menu = await role_model.putGroupMenu(req.body, req.user.username)
        res.status(200).json({
            status: true,
            data_group_menu: update_group_menu.group_menu_data
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