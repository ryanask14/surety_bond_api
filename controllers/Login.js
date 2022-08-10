var request = require('request');
var model = require('../models/index');
var user_model = require('../models/admin_models/user');
var dateFormat = require('dateformat');
var https = require('https');
const { param } = require('../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');
var sha256 = require('js-sha256');
const { getTaskList } = require('../models/approval_models/approval');

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

jsonVal = function (credentials) {
    var Validator = require('jsonschema').Validator;
    var v = new Validator();

    var auth_validation = 
        {
            id: '/auth_surety',
            type: 'object',
            disableFormat: false,
            minProperties: 2,
            properties: {
                username:{type: "string", minLength: 1, maxLength: 255},
                password:{type: "string", minLength: 1, maxLength: 50},                            
            },
            required: ['username', 'password'],
            additionalProperties: false
        }

    var results = v.validate(credentials, auth_validation);

    if(results.errors.length > 0)
    {
        var messages = []
        console.log(results.errors)
        for(i = 0; i < results.errors.length; i++)
        {
            console.log(results.errors[i].name)
            if(results.errors[i].name === 'additionalProperties')
            {
                messages.push({status: false, errorType: 'JSON Structure Error',errorMessage : "Field JSON "+results.errors[i].argument+" Not Allowed", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )})
            }
            else if(results.errors[i].name !== 'additionalProperties')
            {
                if(results.errors[i].name === 'required')
                {
                    messages.push({status: false,errorType: 'Mandatory Field Validation Error or Datatype Error',errorMessage : "JSON Field "+results.errors[i].argument.split("instance.").join("")+" is Required", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )});
                }
                else if(results.errors[i].name === 'minLength')
                {
                    messages.push({status: false,errorType: 'Mandatory Field Validation Error or Datatype Error',errorMessage : "JSON Field "+results.errors[i].property.split("instance.").join("")+" violates minimal length of string", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )});
                }
                else if(results.errors[i].name === 'maxLength')
                {
                    messages.push({status: false,errorType: 'Mandatory Field Validation Error or Datatype Error',errorMessage : "JSON Field "+results.errors[i].property.split("instance.").join("")+" violates maximal length of string", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )});
                }
            }
        }
        console.log(messages);            
        return messages
    }
}

exports.Auth = async function (req, res) {
    var validation = await jsonVal(req.body);

    if(validation)
    {
        res.status(400).json({validation})
    }
    else
    {
        var credentials = await user_model.getUserLogin(req.body.username, sha256.hmac('@skrindo_Sb0',req.body.password))
        console.log(credentials)
        if(!credentials[0])
        {
            var status = await user_model.updateLoginAttempt(req.body.username)
            if(status == false)
            {
                res.status(401).json({
                    status: false, errorType: 'User Management', errorMessage : "Your account has been locked by system, call administrator to unlock your account", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
                })
            }
            else
            {
                res.status(401).json({
                    status: false, errorType: 'User Management', errorMessage : "Invalid username or password", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
                })
            }
        }
        // else if(credentials[0].login_token)
        // {
        //     if(credentials[0].account_locked == true)
        //     {
        //         res.status(401).json({
        //             status: false, errorType: 'User Management', errorMessage : "Your account has been locked by system, call administrator to unlock your account", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
        //         })
        //     }
        //     else
        //     {
        //         res.status(401).json({
        //             status: false, errorType: 'User Management', errorMessage : "Account already logged in, please logout first", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
        //         })
        //     }
        // }
        else
        {
            if(credentials[0].account_locked == true)
            {
                res.status(401).json({
                    status: false, errorType: 'User Management', errorMessage : "Your account has been locked by system, call administrator to unlock your account", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
                })
            }
            else
            {
                var role_credentials = []
                for(let i = 0; i<credentials.length; i++)
                {
                    role_credentials.push(credentials[i].role_name)
                }
                user_menu = await user_model.getUserMenu(req.body.username)
                sorted_menu = sortMenu(user_menu)
                user_product = await user_model.getUserProduct(req.body.username)
                await user_model.resetLoginAttempt(req.body.username)
                get_task_list = await user_model.getTaskList(credentials[0].id_user)
                get_jumlah_task_list = await user_model.getJumlahTaskList(credentials[0].id_user)
                const token = jwt.sign({username: credentials[0].username, role: role_credentials, cabang: credentials[0].id_cabang, fullname: credentials[0].fullname, id_user: credentials[0].id_user}, "secretkey"/*,{expiresIn: "30m"}*/)
                await user_model.updateTokenLogin({username: credentials[0].username, login_token:token})
                res.status(200).json({
                    id_user: credentials[0].id_user,
                    id_group: credentials[0].id_group,
                    id_cabang: credentials[0].id_cabang,
                    id_bp: credentials[0].id_bp,
                    id_tipe_dokumen: credentials[0].id_tipe_dokumen,
                    id_status: credentials[0].id_status,
                    is_top_enable: credentials[0].is_top_enable,
                    account_expired: credentials[0].account_expired,
                    account_locked: credentials[0].account_locked,
                    credential_is_expired: credentials[0].credential_is_expired,
                    confirmation_token: credentials[0].confirmation_token,
                    username: credentials[0].username,
                    fullname: credentials[0].fullname,
                    email: credentials[0].email,
                    is_need_approval: credentials[0].is_need_approval,
                    login_attempt: credentials[0].login_attempt,
                    description: credentials[0].description,
                    is_active: credentials[0].is_active,
                    role: role_credentials,
                    task_list: get_task_list,
                    jumlah_task_list: get_jumlah_task_list,
                    menu: sorted_menu,
                    product: user_product,
                    token: token
                });
            }
        }
    }
}

exports.putPassword = async function (req, res) {
    try
    {
        req.body.password = sha256.hmac('@skrindo_Sb0',req.body.password)
        put_password = await user_model.updatePassword(req.body.password, req.params.id_user, req.user.username)
        res.status(200).json({
            status: true,
            message:'Password updated successfully',
            data: put_password
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

exports.getNotifications = async function (req, res) {
    try
    {
        let refresh_tasklist = await user_model.getTasklistNotifications(req.params.id_user)
        res.status(200).json({
            status: true,
            data: refresh_tasklist
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

exports.forgetPassword = async function (req, res) {
    try{
        let password = makeId(8)
        get_user = await user_model.getUserByEmail(req.body.username)
        if(get_user)
        {
            sendEmail(req.body.username, get_user.username, password)
            password_hash = sha256.hmac('@skrindo_Sb0',password)
            update_password = await user_model.updatePassword(password_hash, get_user.id_user, get_user.username)
            res.status(200).json({
                status: true,
                data: update_password
            })
        }
        else
        {
            res.status(200).json({
                status: true,
                data: ""
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

exports.changePassword = async function (req, res) {
    try{
        get_user = await user_model.getUserByEmail(req.body.email)
        console.log(get_user)
        if(get_user)
        {
            password_hash = sha256.hmac('@skrindo_Sb0',req.body.passwordOld)
            if(get_user.password == password_hash)
            {
                password_hash_new = sha256.hmac('@skrindo_Sb0',req.body.passwordNew)
                update_password = await user_model.updatePassword(password_hash_new, get_user.id_user, get_user.username)
                res.status(200).json({
                    status: true,
                    data: update_password
                })
            }
            else
            {
                res.status(400).json({
                    status: false,
                    message: "Old password doesn't match"
                })
            }
        }
        else
        {
            res.status(200).json({
                status: true,
                data: ""
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

exports.Logout = async function (req, res) {
    const bearer_header = req.header('Authorization')
    const bearer = bearer_header.split(' ')
    const bearer_token = bearer[1]
    try
    {
        const decoded = jwt.verify(bearer_token, "secretkey");
        await user_model.removeTokenLogin(bearer_token)
        res.status(200).json({
            username: decoded.username,
            role: decoded.role_name,
            message: 'Account logged out'
        });
    }
    catch(err)
    {
        await user_model.removeTokenLogin(bearer_token)
        res.status(200).json({
            username: 'Not Found',
            role: 'Not Found',
            message: 'Account already logged out'
        });
    }
    
}