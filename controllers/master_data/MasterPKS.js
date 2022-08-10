var request = require('request');
var model = require('../../models/index');
var pks_model = require('../../models/master_models/pks');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');

exports.getAllPKS = async function (req, res) {
    try
    {
        get_all_pks = await pks_model.getAllPKS()
        res.status(200).json({
            status: true,
            data: get_all_pks,
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

exports.getPKSById = async function (req, res) {
    try
    {
        get_pks_by_id = await pks_model.getPKSById(req.params.id_pks)
        res.status(200).json({
            status: true,
            data: get_pks_by_id,
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

exports.searchPKS = async function (req, res) {
    try
    {
        search_pks = await pks_model.searchPKS(req.params.limit, req.params.offset, req.body)
        res.status(200).json({
            status: true,
            data: search_pks,
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

exports.lookupPKS = async function (req, res) {
    try
    {
        lookup_pks = await pks_model.lookupPKSACS(req.params.limit, req.params.offset, req.body)
        for(let i = 0; i<lookup_pks.lookup_pks.length; i++)
        {
            if(lookup_pks.lookup_pks[i].is_active == '1')
            {
                lookup_pks.lookup_pks[i].is_active = true
            }
            else
            {
                lookup_pks.lookup_pks[i].is_active = false
            }
        }
        res.status(200).json({
            status: true,
            data: lookup_pks,
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

exports.getPKSACSById = async function (req, res) {
    try
    {
        get_pks_acs_by_id = await pks_model.getPKSACSById(req.params.id_pks)
        for(let i = 0; i<get_pks_acs_by_id.get_pks_acs_by_id.length; i++)
        {
            if(get_pks_acs_by_id.get_pks_acs_by_id[i].is_active == '1')
            {
                get_pks_acs_by_id.get_pks_acs_by_id[i].is_active = true
            }
            else
            {
                get_pks_acs_by_id.get_pks_acs_by_id[i].is_active = false
            }
        }
        res.status(200).json({
            status: true,
            data: get_pks_acs_by_id,
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

exports.syncPKS = async function (req, res) {
    try
    {
        sync_pks = await pks_model.syncPKS(req.body, req.user.username)
        if(sync_pks.sync_pks == false)
        {
            res.status(400).json({
                status: false,
                message: 'BP for this PKS not found in ACS',
            })
        }
        else if(sync_pks.sync_pks == true)
        {
            res.status(200).json({
                status: true,
                message: 'BP and PKS are already synchronized'
            })
        }
        else
        {
            res.status(200).json({
                status: true,
                message: 'Insert/update data success',
                data: sync_pks
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