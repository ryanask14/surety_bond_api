var request = require('request');
var model = require('../../models/index');
var user_principal_model = require('../../models/admin_models/userPrincipal');
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

exports.getMasterData = async function (req, res) {
    try
    {
        let get_master_data = await user_principal_model.getMasterData()
        res.status(200).json(get_master_data)
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

exports.getKodePos = async function (req, res) {
    try
    {
        let get_kode_pos = await user_principal_model.getKodePos(req.params.zip_code)
        res.status(200).json(get_kode_pos)
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