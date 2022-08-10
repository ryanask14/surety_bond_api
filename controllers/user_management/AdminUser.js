var request = require('request');
var model = require('../../models/index');
var user_model = require('../../models/admin_models/user');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');
var sha256 = require('js-sha256');
const nodemailer = require("nodemailer");
const { decode } = require('punycode');

function makeId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

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

readHTMLEmail = async function (username, password) {
    return new Promise((resolve, reject) => {
        fs.readFile('../api_surety_online/views/bbbootstrap-snippet.html', 'utf8', function (err,data) {
            if (err) {
                resolve(console.log(err));
            }
            let user = data.replace(/@replace_username/g, username);
            html = user.replace(/@replace_password/g, password);
                resolve(html)
            });
    })
}

sendEmail = async function (email, user, password) {
    try
    {
        let transporter = nodemailer.createTransport({
            host: '172.217.194.109',
            port: 465,
            secure: true,
            auth: {
                user: 'lamahanaufar@gmail.com',
                pass: 'fgbwadlxlecbuxzu',
            },
            tls:{
                rejectUnauthorized:false
            }
        });
     
        // await transporter.verify().then(console.log).catch(console.error);

        let info = await transporter.sendMail({
            from: '"SURETY BOND ONLINE ASKRINDO" <lamahanaufar@gmail.com>',
            to: email,
            subject: "User Verification",
            html: await this.readHTMLEmail(email, password)
        });
     
        console.log("Message sent: %s by "+user, info.messageId);
        return info.messageId;
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.postSearchUser = async function (req, res) {
    try
    {
        let id_cabang = req.body.idCabang
        if(!id_cabang || id_cabang == '')
        {
            id_cabang = req.user.cabang
        }
        console.log(req.user)
        search_user = await user_model.postSearchUser(req.params.limit, req.params.offset, req.body.username, req.body.fullname, req.body.email, id_cabang, req.body.groupUser)
        res.status(200).json({
            status: true,
            data: search_user.user_data,
            data_count: search_user.count_data.data_count
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

exports.getAllUser = async function (req, res) {
    try
    {
        all_user = await user_model.getAllUser(req.user.cabang)
        res.status(200).json({
            status: true,
            data: all_user.user_data,
            data_count: all_user.count_data.data_count
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

exports.postSearchAgen = async function (req, res) {
    try{
        search_agen = await user_model.postSearchAgen(req.params.limit, req.params.offset, req.body.name, req.body.npwp, req.body.idNo, req.body.cifNo)
        res.status(200).json({
            status: true,
            data: search_agen.user_agen,
            data_count: search_agen.count_data.data_count
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

exports.getAllAgen = async function (req, res) {
    try{
        all_agen = await user_model.getAllAgen()
        res.status(200).json({
            status: true,
            data: all_agen.agen_data,
            data_count: all_agen.count_data.data_count
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

exports.getUserById = async function (req, res) {
    try{
        user_by_id = await user_model.getUserById(req.params.id_user)
        user_by_id.menu = sortMenu(user_by_id.menu)
        res.status(200).json({
            status: true,
            data: user_by_id
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

exports.getAllMaster = async function (req, res) {
    try{
        all_agen = await user_model.getAllMaster()
        sorted_menu = sortMenu(all_agen.get_menu)
        all_agen.get_menu = sorted_menu
        res.status(200).json({
            status: true,
            data: all_agen,
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

exports.registerUser = async function (req, res) {
    try{
        get_user = await user_model.getUserByUsername(req.body.username)
        get_email = await user_model.getUserByEmail(req.body.email)
        if(get_user && get_email)
        {
            res.status(400).json({
                status: false,
                message: 'Username '+req.body.username+' and email '+req.body.email+' is already exist'
            })
        }
        else if(get_user && !get_email)
        {
            res.status(400).json({
                status: false,
                message: 'Username '+req.body.username+' is already exist'
            })
        }
        else if(!get_user && get_email)
        {
            res.status(400).json({
                status: false,
                message: 'Email '+req.body.email+' is already exist'
            })
        }
        else
        {
            let password = makeId(8)
            req.body.password = sha256.hmac('@skrindo_Sb0',password)
            let all_user = await user_model.insertUser(req.body, req.user.username, req.user.cabang, req.user.fullname)
            this.sendEmail(req.body.email, req.user.username, password)
            res.status(200).json({
                status: true,
                data: all_user
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

exports.putUser = async function (req, res) {
    try{
        all_user = await user_model.updateUser(req.body, req.user.username)
        res.status(200).json({
            status: true,
            message: 'Update Data Success',
            data: all_user
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