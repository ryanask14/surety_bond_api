var request = require('request');
var model = require('../models/index');
var user_model = require('../models/admin_models/user');
var dateFormat = require('dateformat');
const role = require('../privilege');
var https = require('https');
const { param } = require('../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');

exports.Auth = async function (req, res, next) {
    const bearer_header = req.header('Authorization');
    if (typeof bearer_header == 'undefined')
    {   
        return res.status(401).send('Access Denied: No Token Provided!');
    }
    try {
        const bearer = bearer_header.split(' ')
        const bearer_token = bearer[1]
        const decoded = jwt.verify(bearer_token, "secretkey");
        var user = await user_model.getUserByUsername(decoded.username)
        console.log(req.baseUrl)
        try
        {
            if(role[req.baseUrl] && bearer_token == user.login_token)
            {
                console.log(decoded)
                var role_search = role[req.baseUrl]
                for(let i = 0; i<role_search.length; i++)
                {
                    if(decoded.role.find(element => element == role_search[i]))
                    {
                        req.user = decoded
                        return next();
                    }
                    else
                    {
                        if(role_search.length - 1 == i)
                        {
                            return res.status(401).json({
                                status: false, errorType: 'Token Error',errorMessage : "You don't have privilege to access this page", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
                            });
                        }
                    }
                }
            }
            else
            {
                return res.status(401).json({
                    status: false, errorType: 'Token Error',errorMessage : "User account has been used on another device", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
                });
            }
        }
        catch(err)
        {
            console.log(err)
            return res.status(401).json({
                status: false, errorType: 'Token Error',errorMessage : "You don't have privilege to access this page", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
            });
            
        }
    }
    catch (ex) {
        if(ex.name == 'TokenExpiredError')
        {
            const bearer = bearer_header.split(' ')
            const bearer_token = bearer[1]
            return res.status(401).json({
                status: false, errorType: 'Token Error',errorMessage : "Token Expired", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
            })
        }
        else
        {
            return res.status(401).json({
                status: false, errorType: 'Token Error',errorMessage : "Token Invalid", trxDateResponse: dateFormat(new Date(), "yyyymmddHHMMss" )
            })
        }
    }
}