var model = require('../index');
var approval_model = require('../approval_models/approval.js');
const { query } = require('express');

exports.getMasterData = async function () {
    let get_jenis_badan_hukum = await model.sequelize1.query("SELECT * from m_lookup where lookup_group = 'COMPANY_LEGAL_TYPE' and is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    let get_bidang_usaha = await model.sequelize1.query("SELECT * from m_lookup where lookup_group = 'BUSINESS_TYPE' and is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let get_cabang = await model.sequelize1.query("SELECT id_cabang, nama_cabang from m_cabang where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {get_jenis_badan_hukum: get_jenis_badan_hukum, get_bidang_usaha: get_bidang_usaha, get_cabang: get_cabang}
}

exports.getKodePos = async function (zip_code) {
    let get_kode_pos = []
    if(zip_code.length >= 3)
    {
        get_kode_pos = await model.sequelize1.query("SELECT zip_id, district_id, zip_code, address, address_type from m_zipcode where (zip_code = :zip_code or zip_code like :zip_code1) and is_active = true", {
            replacements:{zip_code: zip_code, zip_code1: zip_code+'%'},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
    }

    return {get_kode_pos: get_kode_pos}
}