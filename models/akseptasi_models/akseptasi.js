var request = require('request');
var model = require('../index');
var dateFormat = require('dateformat');
const role = require('../../privilege');
var https = require('https');
const { param } = require('../../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');
var sha256 = require('js-sha256');
var approval_model = require('../approval_models/approval.js');
const { query } = require('express');

function padWithZeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

exports.getMasterInquiry = async function (user) {
    let get_cabang
    if(user.cabang == 'KP')
    {
        get_cabang = await model.sequelize1.query("select * from m_cabang where is_active = true", {
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
    }
    else
    {
        get_cabang = await model.sequelize1.query("select * from m_cabang where id_cabang = :id_cabang and is_active = true", {
            replacements: {id_cabang: user.cabang},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
    }
    get_group_produk = await model.sequelize1.query("select * from m_product_group where product_group_id = '14' and is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    get_produk = await model.sequelize1.query("select a.* from m_product a, r_user_product_auth b, r_product_auth_product c where a.product_id = c.product_id and b.id_product_auth = c.id_product_auth and b.id_user = :id_user and a.product_group_id = '14' and a.is_active = true", {
        replacements: {id_user: user.id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    get_status_dokumen = await model.sequelize1.query("select * from m_status_dokumen where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {get_cabang: get_cabang, get_group_produk: get_group_produk, get_produk: get_produk, get_status_dokumen: get_status_dokumen}
}

exports.searchBP = async function (limit, offset, partner_type_id, name, npwp, id_no, cif_no) {

    let user_agen = await model.sequelize1.query("select a.id_bp, a.id_no, a.partner_type_id, a.name, a.npwp, a.cif_no from m_bussiness_partner a where (a.partner_type_id is null or UPPER(a.partner_type_id) = :partner_type_id or UPPER(a.partner_type_id) like :partner_type_id1 or UPPER(a.partner_type_id) like :partner_type_id2 or UPPER(a.partner_type_id) like :partner_type_id3) and ((a.name is null or UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp is null or a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no is null or a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no is null or a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3)) limit :limit offset :offset;", {
        replacements: {limit: limit, offset: (limit*(offset-1)), partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp, npwp1: '%'+npwp, npwp2: '%'+npwp+'%', npwp3: npwp+'%', id_no: id_no, id_no1: '%'+id_no, id_no2: '%'+id_no+'%', id_no3: id_no+'%', cif_no: cif_no, cif_no1: '%'+cif_no, cif_no2: '%'+cif_no+'%', cif_no3: cif_no+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let count_data = await model.sequelize1.query("select count(a.id_bp) as data_count from m_bussiness_partner a where (a.partner_type_id is null or UPPER(a.partner_type_id) = :partner_type_id or UPPER(a.partner_type_id) like :partner_type_id1 or UPPER(a.partner_type_id) like :partner_type_id2 or UPPER(a.partner_type_id) like :partner_type_id3) and ((a.name is null or UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp is null or a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no is null or a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no is null or a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3))", {
        replacements: {partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp, npwp1: '%'+npwp, npwp2: '%'+npwp+'%', npwp3: npwp+'%', id_no: id_no, id_no1: '%'+id_no, id_no2: '%'+id_no+'%', id_no3: id_no+'%', cif_no: cif_no, cif_no1: '%'+cif_no, cif_no2: '%'+cif_no+'%', cif_no3: cif_no+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_agen:user_agen, count_data: count_data[0].data_count}
}

exports.searchBPPrincipal = async function (limit, offset, partner_type_id, name, npwp, id_no, cif_no) {

    let user_agen = await model.sequelize1.query("select distinct a.id_bp, a.id_no, a.partner_type_id, a.name, a.npwp, a.cif_no from m_bussiness_partner a, m_user b where a.id_bp = b.id_bp and b.id_group = 2 and (a.partner_type_id is null or UPPER(a.partner_type_id) = :partner_type_id or UPPER(a.partner_type_id) like :partner_type_id1 or UPPER(a.partner_type_id) like :partner_type_id2 or UPPER(a.partner_type_id) like :partner_type_id3) and ((a.name is null or UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp is null or a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no is null or a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no is null or a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3)) limit :limit offset :offset;", {
        replacements: {limit: limit, offset: (limit*(offset-1)), partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp, npwp1: '%'+npwp, npwp2: '%'+npwp+'%', npwp3: npwp+'%', id_no: id_no, id_no1: '%'+id_no, id_no2: '%'+id_no+'%', id_no3: id_no+'%', cif_no: cif_no, cif_no1: '%'+cif_no, cif_no2: '%'+cif_no+'%', cif_no3: cif_no+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    let count_data = await model.sequelize1.query("select distinct count(a.id_bp) as data_count from m_bussiness_partner a, m_user b where a.id_bp = b.id_bp and b.id_group = 2 and (a.partner_type_id is null or UPPER(a.partner_type_id) = :partner_type_id or UPPER(a.partner_type_id) like :partner_type_id1 or UPPER(a.partner_type_id) like :partner_type_id2 or UPPER(a.partner_type_id) like :partner_type_id3) and ((a.name is null or UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp is null or a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no is null or a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no is null or a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3));", {
        replacements: {partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp, npwp1: '%'+npwp, npwp2: '%'+npwp+'%', npwp3: npwp+'%', id_no: id_no, id_no1: '%'+id_no, id_no2: '%'+id_no+'%', id_no3: id_no+'%', cif_no: cif_no, cif_no1: '%'+cif_no, cif_no2: '%'+cif_no+'%', cif_no3: cif_no+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_agen:user_agen, count_data: count_data[0].data_count}
}

exports.getAllAkseptasi = async function (id_cabang, id_status = null, created_by = null) {

    let query_string
    let query_string_count

    if(id_cabang == 'KP')
    {
        if(!id_status)
        {
            query_string = "select a.policy_id, c.nama as status_dokumen, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true order by a.created_date desc"
            query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true"
        }
        else
        {
            query_string = "select a.policy_id, c.nama as status_dokumen, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_status = :id_status order by a.created_date desc"
            query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_status = :id_status"
        }
    }
    else
    {
        if(!id_status)
        {
            if(created_by)
            {
                query_string = "select a.policy_id, c.nama as status_dokumen, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang and a.created_by = :created_by order by a.created_date desc"
                query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang and a.created_by = :created_by"
            }
            else
            {
                query_string = "select a.policy_id, c.nama as status_dokumen, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang order by a.created_date desc"
                query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang"
            }
        }
        else
        {
            if(created_by)
            {
                query_string = "select a.policy_id, c.nama as status_dokumen, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang and a.id_status = :id_status and a.created_by = :created_by order by a.created_date desc"
                query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang and a.id_status = :id_status and a.created_by = :created_by order by a.created_date desc"
            }
            else
            {
                query_string = "select a.policy_id, c.nama as status_dokumen, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang and a.id_status = :id_status"
                query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and a.id_cabang = :id_cabang and a.id_status = :id_status"
            }
        }
    }

    get_policy = await model.sequelize1.query(query_string, {
        replacements:{id_cabang :id_cabang, id_status: id_status, created_by: created_by},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let get_counter = await model.sequelize1.query(query_string_count, {
        replacements:{id_cabang :id_cabang, id_status: id_status, created_by: created_by},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {get_policy: get_policy, get_counter: get_counter}
}

exports.getAkseptasiPaging = async function (body, limit, offset, id_cabang, created_by = null) {

    let query_string
    let query_string_count

    if(id_cabang == 'KP')
    {
        query_string = "select a.policy_id, c.nama as status_dokumen, a.id_cabang, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and ((a.request_no = :request_no or a.request_no like :request_no1 or a.request_no like :request_no2 or a.request_no like :request_no3) and (a.policy_no = :policy_no or a.policy_no like :policy_no1 or a.policy_no like :policy_no2 or a.policy_no like :policy_no3) and (a.customer_name = :customer_name or a.customer_name like :customer_name1 or a.customer_name like :customer_name2 or a.customer_name like :customer_name3)) and (a.product_id = :product_id or a.product_id like :product_id1 or a.product_id like :product_id2 or a.product_id like :product_id3) and (a.id_status::varchar = :id_status or a.id_status::varchar like :id_status1 or a.id_status::varchar like :id_status2 or a.id_status::varchar like :id_status3) order by a.created_date desc limit :limit offset :offset"
        query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and ((a.request_no = :request_no or a.request_no like :request_no1 or a.request_no like :request_no2 or a.request_no like :request_no3) and (a.policy_no = :policy_no or a.policy_no like :policy_no1 or a.policy_no like :policy_no2 or a.policy_no like :policy_no3) and (a.customer_name = :customer_name or a.customer_name like :customer_name1 or a.customer_name like :customer_name2 or a.customer_name like :customer_name3))  and (a.product_id = :product_id or a.product_id like :product_id1 or a.product_id like :product_id2 or a.product_id like :product_id3) and (a.id_status::varchar = :id_status or a.id_status::varchar like :id_status1 or a.id_status::varchar like :id_status2 or a.id_status::varchar like :id_status3)"
    }
    else
    {
        if(created_by)
        {
            query_string = "select a.policy_id, c.nama as status_dokumen, a.id_cabang, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and ((a.request_no = :request_no or a.request_no like :request_no1 or a.request_no like :request_no2 or a.request_no like :request_no3) and (a.policy_no = :policy_no or a.policy_no like :policy_no1 or a.policy_no like :policy_no2 or a.policy_no like :policy_no3) and (a.customer_name = :customer_name or a.customer_name like :customer_name1 or a.customer_name like :customer_name2 or a.customer_name like :customer_name3)) and (a.id_cabang = :id_cabang or a.id_cabang like :id_cabang1 or a.id_cabang like :id_cabang2 or a.id_cabang like :id_cabang3) and (a.product_id = :product_id or a.product_id like :product_id1 or a.product_id like :product_id2 or a.product_id like :product_id3) and (a.id_status::varchar = :id_status or a.id_status::varchar like :id_status1 or a.id_status::varchar like :id_status2 or a.id_status::varchar like :id_status3) and a.created_by = :created_by order by a.created_date desc limit :limit offset :offset"
            query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and ((a.request_no = :request_no or a.request_no like :request_no1 or a.request_no like :request_no2 or a.request_no like :request_no3) and (a.policy_no = :policy_no or a.policy_no like :policy_no1 or a.policy_no like :policy_no2 or a.policy_no like :policy_no3) and (a.customer_name = :customer_name or a.customer_name like :customer_name1 or a.customer_name like :customer_name2 or a.customer_name like :customer_name3)) and (a.id_cabang = :id_cabang or a.id_cabang like :id_cabang1 or a.id_cabang like :id_cabang2 or a.id_cabang like :id_cabang3) and (a.product_id = :product_id or a.product_id like :product_id1 or a.product_id like :product_id2 or a.product_id like :product_id3) and (a.id_status::varchar = :id_status or a.id_status::varchar like :id_status1 or a.id_status::varchar like :id_status2 or a.id_status::varchar like :id_status3) and a.created_by = :created_by"
        }
        else
        {
            query_string = "select a.policy_id, c.nama as status_dokumen, a.id_cabang, a.request_no, a.policy_no, a.customer_name, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.currency_code, b.nilai_jaminan, d.premi, b.created_date from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and ((a.request_no = :request_no or a.request_no like :request_no1 or a.request_no like :request_no2 or a.request_no like :request_no3) and (a.policy_no = :policy_no or a.policy_no like :policy_no1 or a.policy_no like :policy_no2 or a.policy_no like :policy_no3) and (a.customer_name = :customer_name or a.customer_name like :customer_name1 or a.customer_name like :customer_name2 or a.customer_name like :customer_name3)) and (a.id_cabang = :id_cabang or a.id_cabang like :id_cabang1 or a.id_cabang like :id_cabang2 or a.id_cabang like :id_cabang3) and (a.product_id = :product_id or a.product_id like :product_id1 or a.product_id like :product_id2 or a.product_id like :product_id3) and (a.id_status::varchar = :id_status or a.id_status::varchar like :id_status1 or a.id_status::varchar like :id_status2 or a.id_status::varchar like :id_status3) order by a.created_date desc limit :limit offset :offset"
            query_string_count = "select count(a.policy_id) as data_count from t_policy a, t_policy_object_surety b, m_status_dokumen c, t_policy_invoice_premium d where a.policy_id = d.policy_id and a.id_status = c.id_status and a.policy_id = b.policy_id and a.is_active = true and ((a.request_no = :request_no or a.request_no like :request_no1 or a.request_no like :request_no2 or a.request_no like :request_no3) and (a.policy_no = :policy_no or a.policy_no like :policy_no1 or a.policy_no like :policy_no2 or a.policy_no like :policy_no3) and (a.customer_name = :customer_name or a.customer_name like :customer_name1 or a.customer_name like :customer_name2 or a.customer_name like :customer_name3)) and (a.id_cabang = :id_cabang or a.id_cabang like :id_cabang1 or a.id_cabang like :id_cabang2 or a.id_cabang like :id_cabang3) and (a.product_id = :product_id or a.product_id like :product_id1 or a.product_id like :product_id2 or a.product_id like :product_id3) and (a.id_status::varchar = :id_status or a.id_status::varchar like :id_status1 or a.id_status::varchar like :id_status2 or a.id_status::varchar like :id_status3)"
        }
    }

    let get_policy = await model.sequelize1.query(query_string, {
        replacements:{limit: limit, offset: (limit*(offset-1)), request_no: body.requestNo, request_no1: '%'+body.requestNo, request_no2: '%'+body.requestNo+'%', request_no3: body.requestNo+'%', policy_no: body.policyNo, policy_no1: '%'+body.policyNo, policy_no2: '%'+body.policyNo+'%', policy_no3: body.policyNo+'%', customer_name: body.customerName, customer_name1: '%'+body.customerName, customer_name2: '%'+body.customerName+'%', customer_name3: body.customerName+'%', id_cabang: id_cabang, id_cabang1: '%'+id_cabang, id_cabang2: '%'+id_cabang+'%', id_cabang3: id_cabang+'%', product_id: body.productId, product_id1: '%'+body.productId, product_id2: '%'+body.productId+'%', product_id3: body.productId+'%', id_status: body.idStatus, id_status1: '%'+body.idStatus, id_status2: '%'+body.idStatus+'%', id_status3: body.idStatus+'%', created_by: created_by},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let get_counter = await model.sequelize1.query(query_string_count, {
        replacements:{request_no: body.requestNo, request_no1: '%'+body.requestNo, request_no2: '%'+body.requestNo+'%', request_no3: body.requestNo+'%', policy_no: body.policyNo, policy_no1: '%'+body.policyNo, policy_no2: '%'+body.policyNo+'%', policy_no3: body.policyNo+'%', customer_name: body.customerName, customer_name1: '%'+body.customerName, customer_name2: '%'+body.customerName+'%', customer_name3: body.customerName+'%', id_cabang: id_cabang, id_cabang1: '%'+id_cabang, id_cabang2: '%'+id_cabang+'%', id_cabang3: id_cabang+'%', product_id: body.productId, product_id1: '%'+body.productId, product_id2: '%'+body.productId+'%', product_id3: body.productId+'%', id_status: body.idStatus, id_status1: '%'+body.idStatus, id_status2: '%'+body.idStatus+'%', id_status3: body.idStatus+'%', created_by: created_by},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    
    return {get_policy: get_policy, get_counter: get_counter}
}

exports.getAkseptasiById = async function (policy_id) {
    let object_id
    get_policy = await model.sequelize1.query("select * from t_policy a where policy_id = :policy_id and is_active = true", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_policy_commision = await model.sequelize1.query("select * from t_policy_invoice_commision a where policy_id = :policy_id", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_policy_premium = await model.sequelize1.query("select * from t_policy_invoice_premium a where policy_id = :policy_id", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_policy_object_surety = await model.sequelize1.query("select * from t_policy_object_surety a where policy_id = :policy_id and is_active = true", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_policy_summary_object = await model.sequelize1.query("select * from t_policy_summary_object a where policy_id = :policy_id and is_active = true", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        console.log(get_policy_object_surety)
    if(!get_policy_object_surety.length)
    {
        object_id = null
    }
    else
    {
        object_id = get_policy_object_surety[0].object_id
    }
    
    get_surety_kolateral = await model.sequelize1.query("select * from t_surety_kolateral a where object_id = :object_id and is_active = true", {
        replacements:{object_id: object_id}, 
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_policy_attachment = await model.sequelize1.query("select a.*, b.file_extention as file_extension from t_policy_attachmant a, t_file b where a.file_id = b.file_id and a.policy_id = :policy_id and a.is_active = true", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {get_policy: get_policy, get_policy_commision: get_policy_commision, get_policy_premium: get_policy_premium, get_policy_object_surety: get_policy_object_surety, get_policy_summary_object: get_policy_summary_object, get_surety_kolateral: get_surety_kolateral, get_policy_attachment: get_policy_attachment}
}

exports.getMasterInsert = async function (product_id, id_bp = null) {    
    let get_template_sertifikat = await model.sequelize1.query("select a.* from m_tempalate_sertifikat a, r_product_template_sertifikat b where a.id_template = b.id_template and b.product_id = :product_id and is_active = true order by ordering", {
        replacements: {product_id: product_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_currency = await model.sequelize1.query("select * from m_currency where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_jenis_pembayaran = await model.sequelize1.query("select * from m_jenis_pembayaran where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_tipe_obligee = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_OBLIGEE_TYPE'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_jenis_proyek = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_PROJECT_TYPE'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_sumber_dana = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_FUND_SOURCE'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_tipe_kolateral = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_TIPE_KOLATERAL'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_jenis_kolateral = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_JENIS_KOLATERAL'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_jenis_dokumen = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_JENIS_DOKUMEN'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})  
    let get_jenis_pengikatan = await model.sequelize1.query("select * from m_lookup where is_active = true and lookup_group = 'SURETY_PENGIKATAN_SPKMGR'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    let get_dokumen_bp = await model.sequelize1.query("select * from m_bp_dokumen where id_bp = :id_bp and is_active = true", {
        replacements: {id_bp: id_bp},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {get_currency: get_currency, get_jenis_pembayaran: get_jenis_pembayaran, get_tipe_obligee: get_tipe_obligee, get_jenis_proyek: get_jenis_proyek, get_sumber_dana: get_sumber_dana, get_tipe_kolateral: get_tipe_kolateral, get_jenis_kolateral: get_jenis_kolateral, get_jenis_dokumen: get_jenis_dokumen, get_jenis_pengikatan: get_jenis_pengikatan, get_template_sertifikat: get_template_sertifikat, get_dokumen_bp: get_dokumen_bp}
}

exports.getDefaultValue = async function (body) {
    let pct_rate    
    let rate_komisi
    if(body.jangkaWaktuBulan >12)
    {
        get_rate_premi = await model.sequelize1.query("SELECT * FROM m_rate_surety WHERE product_id = :product_id AND :jangka_waktu_bulan BETWEEN tenor_awal AND tenor_akhir", {
            replacements:{product_id: body.productId, jangka_waktu_bulan: 12},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})

        pct_rate = get_rate_premi[0].rate * body.jangkaWaktuBulan/12
    }
    else
    {
        get_rate_premi = await model.sequelize1.query("SELECT * FROM m_rate_surety WHERE product_id = :product_id AND :jangka_waktu_bulan BETWEEN tenor_awal AND tenor_akhir", {
            replacements:{product_id: body.productId, jangka_waktu_bulan: body.jangkaWaktuBulan},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
        
        pct_rate = get_rate_premi[0].rate
    }

    get_rate_komisi = await model.sequelize1.query("SELECT * FROM r_pks_product where product_id = :product_id", {
        replacements:{product_id: body.productId},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    if(!get_rate_komisi.length || !get_rate_komisi[0].json_data)
    {
        rate_komisi = 0
    }
    else
    {
        json_komisi = JSON.parse(get_rate_komisi[0].json_data)
        rate_komisi = json_komisi.commissionRate
    }
    
    return {rate: pct_rate, rate_komisi: rate_komisi, pph: 10, ppn: 10}
}

exports.updateSchedulerExpiredVa = async function () {
    let get_expired_va = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy set id_status = 4 where id_status = 5 and id_tipe_dokumen = 301 and (policy_no is null or policy_no = '') and (va_number is not null and va_number != '') and now() >= va_expired_date returning policy_id;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return get_expired_va
}

exports.insertProyekDoc = async function (body, created_by) {

    insert_dok_proyek = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO t_file(file_id, file_name, file_type, file_extention, file_size, data_file, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :file_name, :file_type, :file_extention, :file_size, :data_file, true, 0, '', now()) returning file_id, file_name, file_type, file_extention, file_size;", {
        replacements: {file_name: body.originalname, file_type:body.mimetype, file_extention: body.originalname.substring(body.originalname.lastIndexOf('.'), body.originalname.length), file_size: body.size, data_file: body.buffer, created_by: created_by},
        type: model.sequelize1.QueryTypes.INSERT,
        quoteIdentifiers: true})
    
    return {insert_dok_proyek: insert_dok_proyek}
}

exports.insertAkseptasi = async function (body, user, policy_no, va_number) {
    let id_bp
    let id_sumber_bisnis
    let pks_no
    let request_no
    let pct_rate
    let premi_gross
    let json_komisi
    let rate_komisi
    let komisi

    try{
        return await model.sequelize1.transaction(async (t) => {

            get_user_login = await model.sequelize1.query("select * from m_user where id_user = :id_user", {
                replacements:{id_user: user.id_user},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(user.role.find(element => element == 'role_agen'))
            {
                id_bp = get_user_login[0].id_bp
            }
            else
            {
                id_bp = null
            }
            if(get_user_login[0].id_group == 1)
            {
                get_sumber_bisnis = await model.sequelize1.query("select b.* from m_bussiness_partner a, m_sumber_bisnis b where a.partner_type_id = b.partner_type_id and id_bp = :id_bp", {
                    replacements:{id_bp: get_user_login[0].id_bp},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})

                get_pks = await model.sequelize1.query("select * from m_pks where id_bp = :id_bp", {
                    replacements:{id_bp: get_user_login[0].id_bp},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})

                id_sumber_bisnis = get_sumber_bisnis[0].id_sumber_bisnis
                pks_no = get_pks[0].no_pks
            }
            else
            {
                id_sumber_bisnis = null
                pks_no = null
            }
            get_counter = await model.sequelize1.query("SELECT nextval('sbo_request_no_seq') as counter", {
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            
            if(body.jangkaWaktuBulan >12)
            {
                get_rate_premi = await model.sequelize1.query("SELECT * FROM m_rate_surety WHERE product_id = :product_id AND :jangka_waktu_bulan BETWEEN tenor_awal AND tenor_akhir", {
                    replacements:{product_id: body.productId, jangka_waktu_bulan: 12},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})

                pct_rate = get_rate_premi[0].rate * body.jangkaWaktuBulan/12
            }
            else
            {
                get_rate_premi = await model.sequelize1.query("SELECT * FROM m_rate_surety WHERE product_id = :product_id AND :jangka_waktu_bulan BETWEEN tenor_awal AND tenor_akhir", {
                    replacements:{product_id: body.productId, jangka_waktu_bulan: body.jangkaWaktuBulan},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                
                pct_rate = get_rate_premi[0].rate
            }
            
            premi_gross = body.nilaiJaminan * pct_rate / 100
            if(premi_gross < 50000)
            {
                premi_gross = 50000
            }

            get_rate_komisi = await model.sequelize1.query("SELECT * FROM r_pks_product where product_id = :product_id", {
                replacements:{product_id: body.productId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            
            if(!get_rate_komisi.length || !get_rate_komisi[0].json_data)
            {
                rate_komisi = 0
                komisi = 0
            }
            else
            {
                json_komisi = JSON.parse(get_rate_komisi[0].json_data)
                rate_komisi = json_komisi.commissionRate
                komisi = premi_gross * rate_komisi / 100
            }

            request_no = body.productId+dateFormat(new Date(), "yy")+padWithZeroes(+get_counter[0].counter,8)
            
            insert_t_policy = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy(policy_id, id_tipe_dokumen, id_status, product_id, agen_id, id_cabang, id_sumber_bisnis, id_jenis_pembayaran, creation_type, is_top, request_no, policy_no, pks_agent_no, pct_share_askrindo, sales_id, customer_id, production_user, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, jangka_waktu_hari, jangka_waktu_bulan, tgl_terbit, posting_date, va_number, is_disclaimer, is_active, version, created_by, created_date, modified_date, modified_by, jenis_sertifikat, customer_name, agen_name, id_template_sertifikat)VALUES(uuid_generate_v4(), 301, :id_status, :product_id, :agen_id, :id_cabang, :id_sumber_bisnis, :id_jenis_pembayaran, 'N', :is_top, :request_no, :policy_no, :pks_agent_no, 100, :sales_id, :customer_id, :production_user, :tgl_awal_pertanggungan, :tgl_akhir_pertanggungan, :jangka_waktu_hari, :jangka_waktu_bulan, :tgl_terbit, now(), :va_number, :is_disclaimer, true, 0, :created_by, now(), null, null, :jenis_sertifikat, :customer_name, :agen_name, :id_template_sertifikat) returning *;", {
                replacements: {id_status: body.idStatus, product_id: body.productId, agen_id: id_bp, id_cabang: get_user_login[0].id_cabang, id_sumber_bisnis: id_sumber_bisnis, id_jenis_pembayaran: body.idJenisPembayaran, is_top: body.mekanismePembayaran, request_no : request_no, policy_no: policy_no, pks_agent_no: pks_no, sales_id: null, customer_id: body.principalId, production_user: null, tgl_awal_pertanggungan: body.tglAwalPertanggungan, tgl_akhir_pertanggungan: body.tglAkhirPertanggungan, jangka_waktu_hari: body.jangkaWaktuHari, jangka_waktu_bulan: body.jangkaWaktuBulan, tgl_terbit: body.tglTerbit, va_number: va_number, is_disclaimer: body.isDisclaimer, created_by: user.username, jenis_sertifikat: 'N', customer_name: body.principalName, agen_name: user.fullname, id_template_sertifikat: body.idTemplateSertifikat},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            insert_t_policy_object = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_object_surety(object_id, policy_id, principal_id, principal_name, principal_address, principal_zipcode, hari_daluarsa_klaim, tgl_daluarsa_klaim, currency_code, nilai_proyek, nilai_jaminan, pct_nilai_jaminan, pct_rate, pct_rate_pengajuan, pct_rate_usulan, pct_rate_disetujui, premi_gross, komisi, premi_nett, obligee_id, tipe_obligee, obligee_name, obligee_address, obligee_zipcode, nama_proyek, alamat_proyek, jenis_proyek, sumber_dana, no_spkmgr, jenis_pengikatan, tgl_mulai_spkmgr, tgl_akhir_spkmgr, batas_pembayaran_spkmgr, pct_denda_spkmgr, is_colateral, is_active, version, created_by, created_date, modified_by, modified_date, rekomdendasi_keputusan, nama_jabatan, nama_pejabat)VALUES(uuid_generate_v4(), :policy_id, null, :principal_name, :principal_address, :principal_zipcode, null, null, :currency_code, :nilai_proyek, :nilai_jaminan, :pct_nilai_jaminan, :pct_rate, :pct_rate_pengajuan, :pct_rate_usulan, :pct_rate_disetujui, :premi_gross, :komisi, :premi_nett, null, :tipe_obligee, :obligee_name, :obligee_address, :obligee_zipcode, :nama_proyek, :alamat_proyek, :jenis_proyek, :sumber_dana, :no_spkmgr, :jenis_pengikatan, :tgl_mulai_spkmgr, :tgl_akhir_spkmgr, :batas_pembayaran_spkmgr, :pct_denda_spkmgr, :is_colateral, true, 0, :created_by, now(), null, null, :rekomendasi_keputusan, :nama_jabatan, :nama_pejabat) returning *;", {
                replacements: {policy_id: insert_t_policy[0][0].policy_id, principal_name: body.principalName, principal_address: body.principalAddress, principal_zipcode: body.principalZipcode, currency_code: body.currencyCode, nilai_proyek: body.nilaiProyek, nilai_jaminan: body.nilaiJaminan, pct_nilai_jaminan: body.pctNilaiJaminan, pct_rate: pct_rate, pct_rate_pengajuan: pct_rate, pct_rate_usulan: pct_rate, pct_rate_disetujui: pct_rate, premi_gross: premi_gross, komisi: komisi, premi_nett: premi_gross - komisi, tipe_obligee: body.tipeObligee, obligee_name: body.obligeeName, obligee_address: body.obligeeAddress, obligee_zipcode: body.obligeeZipcode, nama_proyek: body.namaProyek, alamat_proyek: body.alamatProyek, jenis_proyek: body.jenisProyek, sumber_dana: body.sumberDana, no_spkmgr: body.noSpkmgr, jenis_pengikatan: body.jenisPengikatan, tgl_mulai_spkmgr: body.tglMulaiSpkmgr, tgl_akhir_spkmgr: body.tglAkhirSpkmgr, batas_pembayaran_spkmgr: body.batasPembayaranSpkmgr, pct_denda_spkmgr: body.pctDendaSpkmgr, is_colateral: body.isColateral, created_by: user.username, rekomendasi_keputusan: body.rekomendasiKeputusan, nama_jabatan: body.namaJabatan, nama_pejabat: body.namaPejabat},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            insert_t_policy_invoice_premium = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_invoice_premium(invoice_id, policy_id, currency_code, premi, tgl_jatuh_tempo, invoice_no, invoice_date, is_lunas, tgl_bayar, jml_bayar, no_jurnal, version, created_by, created_date, modified_by, modified_date, biaya_polis, biaya_materai, premi_prev, premi_delta)VALUES(uuid_generate_v4(), :policy_id, :currency_code, :premi, :tgl_jatuh_tempo, null, null, false, null, null, null, 0, :created_by, now(), null, null, :biaya_polis, :biaya_materai, :premi_prev, :premi_delta) returning *;", {
                replacements: {policy_id: insert_t_policy[0][0].policy_id, currency_code: body.currencyCode, premi: premi_gross, tgl_jatuh_tempo: body.tglJatuhTempo, created_by: user.username, biaya_polis: 20000, biaya_materai: 10000, premi_prev: 0, premi_delta: premi_gross - 0},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            insert_t_policy_invoice_commision = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_invoice_commision(invoice_id, policy_id, currency_code, komisi, pph, ppn, komisi_nett, is_lunas, tgl_bayar, jml_bayar, no_jurnal, version, created_by, created_date, modified_by, modified_date, komisi_prev, komisi_delta, pph_prev, pph_delta, ppn_prev, ppn_delta)VALUES(uuid_generate_v4(), :policy_id, :currency_code, :komisi, :pph, :ppn, :komisi_nett, false, null, null, null, 0, :created_by, now(), null, null, :komisi_prev, :komisi_delta, :pph_prev, :pph_delta, :ppn_prev, :ppn_delta) returning *;", {
                replacements: {policy_id: insert_t_policy[0][0].policy_id, currency_code: body.currencyCode, komisi: komisi, pph: body.pph, ppn: body.ppn, komisi_nett: komisi - body.ppn - body.pph, created_by: user.username, komisi_prev: 0, komisi_delta: komisi - 0, pph_prev: 0, pph_delta: body.pph - 0, ppn_prev: 0, ppn_delta: body.ppn - 0},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            insert_t_policy_summary_object = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_summary_object(summary_objet_id, policy_id, object_name, object_desc, premi_prev, premi, premi_delta, tsi_prev, tsi, tsi_delta, komisi_prev, komisi, komisi_delta, ppn_prev, ppn, ppn_delta, pph_prev, pph, pph_delta, is_active, version, created_by, created_date, modified_by, modified_date, currency_code)VALUES(uuid_generate_v4(), :policy_id, :object_name, :object_desc, :premi_prev, :premi, :premi_delta, :tsi_prev, :tsi, :tsi_delta, :komisi_prev, :komisi, :komisi_delta, :ppn_prev, :ppn, :ppn_delta, :pph_prev, :pph, :pph_delta, false, 0, :created_by, now(), null, null, :currency_code) returning *;", {
                replacements: {policy_id: insert_t_policy[0][0].policy_id, currency_code: body.currencyCode, object_name: body.namaProyek, object_desc: body.namaProyek+' - '+body.alamatProyek, premi_prev: 0, premi: premi_gross, premi_delta: premi_gross - 0, tsi_prev: 0, tsi: body.nilaiJaminan, tsi_delta: body.nilaiJaminan - 0, komisi_prev: 0, komisi: komisi, komisi_delta: komisi - 0, ppn_prev: 0, ppn: body.ppn, ppn_delta: body.ppn - 0, pph_prev: 0, pph: body.pph, pph_delta: body.pph - 0, created_by: user.username},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})
            
            if(body.isColateral = true)
            {
                for(let i = 0; i<body.dataKolateral.length; i++)
                {
                    insert_t_surety_kolateral = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_surety_kolateral(id_agunan, object_id, tipe_kolateral, pct_kolateral, nilai_kolateral, jenis_kolateral, jenis_dokumen, no_dokumen, no_rekening, jenis_pengikatan, no_akte_pengikatan, tgl_awal_pengikatan, tgl_akhir_pengikatan, tgl_terima_dokumen, tgl_kembali_dokumen, keterangan, is_active, version, created_by, created_date, modified_by, modified_date)VALUES(uuid_generate_v4(), :object_id, :tipe_kolateral, :pct_kolateral, :nilai_kolateral, :jenis_kolateral, :jenis_dokumen, :no_dokumen, :no_rekening, :jenis_pengikatan, :no_akte_pengikatan, :tgl_awal_pengikatan, :tgl_akhir_pengikatan, :tgl_terima_dokumen, :tgl_kembali_dokumen, :keterangan, true, 0, :created_by, now(), null, null) returning *;", {
                        replacements: {object_id: insert_t_policy_object[0][0].object_id, tipe_kolateral: body.dataKolateral[i].tipeKolateral, pct_kolateral: body.dataKolateral[i].pctKolateral, nilai_kolateral: body.dataKolateral[i].nilaiKolateral, jenis_kolateral: body.dataKolateral[i].jenisKolateral, jenis_dokumen: body.dataKolateral[i].jenisDokumen, no_dokumen: body.dataKolateral[i].noDokumen, no_rekening: body.dataKolateral[i].noRekening, jenis_pengikatan: body.dataKolateral[i].jenisPengikatan, no_akte_pengikatan: body.dataKolateral[i].noAktePengikatan, tgl_awal_pengikatan: body.dataKolateral[i].tglAwalPengikatan, tgl_akhir_pengikatan: body.dataKolateral[i].tglAkhirPengikatan, tgl_terima_dokumen: body.dataKolateral[i].tglTerimaDokumen, tgl_kembali_dokumen: body.dataKolateral[i].tglKembaliDokumen, keterangan: body.dataKolateral[i].keterangan, created_by: user.username},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t})
                }
            }
            if(body.idFile.length)
            {
                get_policy_attachment = await model.sequelize1.query("select * from t_policy_attachmant where policy_id = :policy_id;", {
                    replacements: {policy_id: insert_t_policy[0][0].policy_id},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                
                    if(get_policy_attachment.length)
                    {
                        for(let i = 0; i < body.jenisDokumen.length; i++)
                        {
                            get_policy_attachment = await model.sequelize1.query("select * from t_policy_attachmant where policy_id = :policy_id;", {
                                replacements: {policy_id: insert_t_policy[0][0].policy_id},
                                type: model.sequelize1.QueryTypes.SELECT,
                                quoteIdentifiers: true, transaction: t})
                                
                            if(get_policy_attachment.filter(value => value.jenis_dokumen == body.jenisDokumen[i]).length)
                            {
                                update_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update t_policy_attachmant set is_active = false, modified_by = :modified_by, modified_date = now() where jenis_dokumen = :jenis_dokumen and policy_id = :policy_id;", {
                                    replacements: {policy_id: insert_t_policy[0][0].policy_id, jenis_dokumen: body.jenisDokumen[i], modified_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                                
                                insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(), :policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                    replacements: {policy_id: insert_t_policy[0][0].policy_id, order_id: get_policy_attachment.filter(value => value.jenis_dokumen == body.jenisDokumen[i])[0].order_id, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                            }
                            else
                            {
                                get_max_urutan = await model.sequelize1.query("select max(order_id) as urutan from t_policy_attachmant where policy_id = :policy_id;", {
                                    replacements: {policy_id: insert_t_policy[0][0].policy_id},
                                    type: model.sequelize1.QueryTypes.SELECT,
                                    quoteIdentifiers: true, transaction: t})
                                
                                insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(),:policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                    replacements: {policy_id: insert_t_policy[0][0].policy_id, order_id: +get_max_urutan[0].urutan+1, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                            }
                        }
                    }
                    else
                    {
                        for(let i = 0; i<body.idFile.length; i++)
                        {
                            insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(), :policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                replacements: {policy_id: insert_t_policy[0][0].policy_id, order_id: +i+1, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                    }
            }
            if(body.idStatus == 2)
            {
                body.disposisi.dokumentId = insert_t_policy[0][0].policy_id
                body.disposisi.dokumentNo = insert_t_policy[0][0].request_no
                body.idTipeDokumen = 301
                console.log(body)
                insert_disposisi = await approval_model.insertDisposisi(body.idTipeDokumen, insert_t_policy[0][0].policy_id, body.idStatus, body.disposisi.disposisi, user.fullname);
                insert_tasklist = await approval_model.insertTaskList(body, user.username); 
            }
            else
            {
                body.disposisi.dokumentId = insert_t_policy[0][0].policy_id
                body.disposisi.dokumentNo = insert_t_policy[0][0].request_no
                body.idTipeDokumen = 301
                console.log(body)
                insert_tasklist = await approval_model.insertTaskList(body, user.username); 
            }
            
            return insert_t_policy[0][0].policy_id
        })
    }
    catch(e)
    {
        console.log(e)
        throw new Error(e)
    }
}

exports.updateAkseptasi = async function (body, user) {
    let id_bp
    let id_sumber_bisnis
    let pks_no
    let request_no
    let pct_rate
    let premi_gross
    let json_komisi
    let rate_komisi
    let komisi

    try{
        return await model.sequelize1.transaction(async (t) => {
            get_user_login = await model.sequelize1.query("select * from m_user where id_user = :id_user", {
                replacements:{id_user: user.id_user},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(user.role.find(element => element == 'role_agen'))
            {
                id_bp = get_user_login[0].id_bp
            }
            else
            {
                id_bp = null
            }
            if(get_user_login[0].id_group == 1)
            {
                get_sumber_bisnis = await model.sequelize1.query("select b.* from m_bussiness_partner a, m_sumber_bisnis b where a.partner_type_id = b.partner_type_id and id_bp = :id_bp", {
                    replacements:{id_bp: get_user_login[0].id_bp},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})

                get_pks = await model.sequelize1.query("select * from m_pks where id_bp = :id_bp", {
                    replacements:{id_bp: get_user_login[0].id_bp},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})

                id_sumber_bisnis = get_sumber_bisnis[0].id_sumber_bisnis
                pks_no = get_pks[0].no_pks
            }
            else
            {
                id_sumber_bisnis = null
                pks_no = null
            }
            get_counter = await model.sequelize1.query("SELECT nextval('sbo_request_no_seq') as counter", {
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            
            if(body.jangkaWaktuBulan >12)
            {
                get_rate_premi = await model.sequelize1.query("SELECT * FROM m_rate_surety WHERE product_id = :product_id AND :jangka_waktu_bulan BETWEEN tenor_awal AND tenor_akhir", {
                    replacements:{product_id: body.productId, jangka_waktu_bulan: 12},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})

                pct_rate = get_rate_premi[0].rate * body.jangkaWaktuBulan/12
            }
            else
            {
                get_rate_premi = await model.sequelize1.query("SELECT * FROM m_rate_surety WHERE product_id = :product_id AND :jangka_waktu_bulan BETWEEN tenor_awal AND tenor_akhir", {
                    replacements:{product_id: body.productId, jangka_waktu_bulan: body.jangkaWaktuBulan},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                
                pct_rate = get_rate_premi[0].rate
            }
            
            premi_gross = body.nilaiJaminan * pct_rate / 100
            if(premi_gross < 50000)
            {
                premi_gross = 50000
            }

            get_rate_komisi = await model.sequelize1.query("SELECT * FROM r_pks_product where product_id = :product_id", {
                replacements:{product_id: body.productId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            
            if(!get_rate_komisi.length || !get_rate_komisi[0].json_data)
            {
                rate_komisi = 0
                komisi = 0
            }
            else
            {
                json_komisi = JSON.parse(get_rate_komisi[0].json_data)
                rate_komisi = json_komisi.commissionRate
                komisi = premi_gross * rate_komisi / 100
            }

            // request_no = body.productId+dateFormat(new Date(), "yy")+padWithZeroes(+get_counter[0].counter,8)
            
            get_policy = await model.sequelize1.query("select * from t_policy where policy_id = :policy_id;", {
                replacements: {policy_id: body.policyId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            
            get_policy_object = await model.sequelize1.query("select * from t_policy_object_surety where policy_id = :policy_id;", {
                replacements: {policy_id: body.policyId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            get_invoice_premium = await model.sequelize1.query("select * from t_policy_invoice_premium where policy_id = :policy_id;", {
                replacements: {policy_id: body.policyId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            get_invoice_commision = await model.sequelize1.query("select * from t_policy_invoice_commision where policy_id = :policy_id;", {
                replacements: {policy_id: body.policyId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            get_policy_object_summary = await model.sequelize1.query("select * from t_policy_summary_object where policy_id = :policy_id;", {
                replacements: {policy_id: body.policyId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            get_surety_kolateral = await model.sequelize1.query("select * from t_surety_kolateral where object_id = :object_id;", {
                replacements: {object_id: get_policy_object[0].object_id},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            update_t_policy = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_policy SET id_status= :id_status, product_id= :product_id, id_jenis_pembayaran= :id_jenis_pembayaran, is_top= :is_top, sales_id= :sales_id, customer_id= :customer_id, production_user= :production_user, tgl_awal_pertanggungan= :tgl_awal_pertanggungan, tgl_akhir_pertanggungan= :tgl_akhir_pertanggungan, jangka_waktu_hari= :jangka_waktu_hari, jangka_waktu_bulan= :jangka_waktu_bulan, tgl_terbit= :tgl_terbit, posting_date= now(), is_disclaimer= :is_disclaimer, is_active=true, version= :version, modified_by= :modified_by, modified_date= now(), jenis_sertifikat= :jenis_sertifikat, customer_name= :customer_name, agen_name= :agen_name, id_template_sertifikat= :id_template_sertifikat WHERE policy_id= :policy_id returning *;", {
                replacements: {policy_id: body.policyId, id_status: body.idStatus, product_id: body.productId, id_jenis_pembayaran: body.idJenisPembayaran, is_top: body.mekanismePembayaran, sales_id: null, customer_id: body.principalId, production_user: null, tgl_awal_pertanggungan: body.tglAwalPertanggungan, tgl_akhir_pertanggungan: body.tglAkhirPertanggungan, jangka_waktu_hari: body.jangkaWaktuHari, jangka_waktu_bulan: body.jangkaWaktuBulan, tgl_terbit: body.tglTerbit, is_disclaimer: body.isDisclaimer, version: +get_policy[0].version+1, modified_by: user.username, jenis_sertifikat: 'N', customer_name: body.principalName, agen_name: user.fullname, id_template_sertifikat: body.idTemplateSertifikat},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})
            
            update_t_policy_object = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_policy_object_surety SET principal_name = :principal_name, principal_address = :principal_address, principal_zipcode = :principal_zipcode, currency_code = :currency_code, nilai_proyek = :nilai_proyek, nilai_jaminan = :nilai_jaminan, pct_nilai_jaminan = :pct_nilai_jaminan, pct_rate = :pct_rate, pct_rate_pengajuan = :pct_rate_pengajuan, pct_rate_usulan = pct_rate_usulan, pct_rate_disetujui = pct_rate_disetujui, premi_gross = :premi_gross, komisi = :komisi, premi_nett = :premi_nett, obligee_id = null, tipe_obligee = :tipe_obligee, obligee_name = :obligee_name, obligee_address = :obligee_address, obligee_zipcode = :obligee_zipcode, nama_proyek = :nama_proyek, alamat_proyek = :alamat_proyek, jenis_proyek = :jenis_proyek, sumber_dana = :sumber_dana, no_spkmgr = :no_spkmgr, jenis_pengikatan = :jenis_pengikatan, tgl_mulai_spkmgr = :tgl_mulai_spkmgr, tgl_akhir_spkmgr = :tgl_akhir_spkmgr, batas_pembayaran_spkmgr = :batas_pembayaran_spkmgr, pct_denda_spkmgr = :pct_denda_spkmgr, is_colateral = :is_colateral, is_active = true, version = :version, modified_by = :modified_by, modified_date = now(), rekomdendasi_keputusan = :rekomendasi_keputusan WHERE object_id = :object_id;", {
                replacements: {object_id: get_policy_object[0].object_id, principal_name: body.principalName, principal_address: body.principalAddress, principal_zipcode: body.principalZipcode, currency_code: body.currencyCode, nilai_proyek: body.nilaiProyek, nilai_jaminan: body.nilaiJaminan, pct_nilai_jaminan: body.pctNilaiJaminan, pct_rate: pct_rate, pct_rate_pengajuan: pct_rate, pct_rate_usulan: pct_rate, pct_rate_disetujui: pct_rate, premi_gross: premi_gross, komisi: komisi, premi_nett: premi_gross - komisi, tipe_obligee: body.tipeObligee, obligee_name: body.obligeeName, obligee_address: body.obligeeAddress, obligee_zipcode: body.obligeeZipcode, nama_proyek: body.namaProyek, alamat_proyek: body.alamatProyek, jenis_proyek: body.jenisProyek, sumber_dana: body.sumberDana, no_spkmgr: body.noSpkmgr, jenis_pengikatan: body.jenisPengikatan, tgl_mulai_spkmgr: body.tglMulaiSpkmgr, tgl_akhir_spkmgr: body.tglAkhirSpkmgr, batas_pembayaran_spkmgr: body.batasPembayaranSpkmgr, pct_denda_spkmgr: body.pctDendaSpkmgr, is_colateral: body.isColateral, modified_by: user.username, rekomendasi_keputusan: body.rekomendasiKeputusan, version: +get_policy_object[0].version+1},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            update_t_policy_invoice_premium = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_policy_invoice_premium SET currency_code = :currency_code, premi = :premi, tgl_jatuh_tempo = :tgl_jatuh_tempo, invoice_no = null, invoice_date = null, is_lunas = false, tgl_bayar = null, jml_bayar = null, no_jurnal = null, version = :version, modified_by = :modified_by, modified_date = now(), biaya_polis = :biaya_polis, biaya_materai = :biaya_materai, premi_prev = :premi_prev, premi_delta = :premi_delta WHERE invoice_id = :invoice_id_premium returning *;", {
                replacements: {invoice_id_premium: get_invoice_premium[0].invoice_id, currency_code: body.currencyCode, premi: premi_gross, tgl_jatuh_tempo: body.tglJatuhTempo, version: +get_invoice_premium[0].version+1, modified_by: user.username, biaya_polis: 20000, biaya_materai: 10000, premi_prev: 0, premi_delta: premi_gross - 0},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            update_t_policy_invoice_commision = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_policy_invoice_commision SET currency_code=:currency_code, komisi=:komisi, pph=:pph, ppn=:ppn, komisi_nett=:komisi_nett, is_lunas=false, tgl_bayar=null, jml_bayar=null, no_jurnal=null, version=:version, modified_by=:modified_by, modified_date=now(), komisi_prev=:komisi_prev, komisi_delta=:komisi_delta, pph_prev=:pph_prev, pph_delta=:pph_delta, ppn_prev=:ppn_prev, ppn_delta=:ppn_delta WHERE invoice_id = :invoice_id_commision returning *;", {
                replacements: {invoice_id_commision: get_invoice_commision[0].invoice_id, currency_code: body.currencyCode, komisi: komisi, pph: body.pph, ppn: body.ppn, komisi_nett: komisi - body.ppn - body.pph, version: +get_invoice_commision[0].version+1, modified_by: user.username, komisi_prev: 0, komisi_delta: komisi - 0, pph_prev: 0, pph_delta: body.pph - 0, ppn_prev: 0, ppn_delta: body.ppn - 0},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            update_t_policy_summary_object = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_policy_summary_object SET object_name= :object_name, object_desc= :object_desc, premi_prev= :premi_prev, premi= :premi, premi_delta= :premi_delta, tsi_prev= :tsi_prev, tsi= :tsi, tsi_delta= :tsi_delta, komisi_prev= :komisi_prev, komisi= :komisi, komisi_delta= :komisi_delta, ppn_prev= :ppn_prev, ppn= :ppn, ppn_delta= :ppn_delta, pph_prev= :pph_prev, pph= :pph, pph_delta= :pph_delta, is_active= true, version= :version, modified_by= :modified_by, modified_date= now(), currency_code= :currency_code WHERE summary_objet_id= :summary_object_id;", {
                replacements: {summary_object_id: get_policy_object_summary[0].summary_objet_id, currency_code: body.currencyCode, object_name: body.namaProyek, object_desc: body.namaProyek+' - '+body.alamatProyek, premi_prev: 0, premi: premi_gross, premi_delta: premi_gross - 0, tsi_prev: 0, tsi: body.nilaiJaminan, tsi_delta: body.nilaiJaminan - 0, komisi_prev: 0, komisi: komisi, komisi_delta: komisi - 0, ppn_prev: 0, ppn: body.ppn, ppn_delta: body.ppn - 0, pph_prev: 0, pph: body.pph, pph_delta: body.pph - 0, modified_by: user.username, version: +get_policy_object_summary[0].version+1},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})
            
            if(body.isColateral = true)
            {
                for(let i = 0; i < body.dataKolateral.length; i++)
                {
                    get_data_kolateral = await model.sequelize1.query("select * from t_surety_kolateral where object_id = :object_id;", {
                        replacements: {object_id:get_policy_object[0].object_id},
                        type: model.sequelize1.QueryTypes.SELECT,
                        quoteIdentifiers: true, transaction: t})
                        
                    if(get_data_kolateral.filter(value => value.no_dokumen == body.dataKolateral[i].noDokumen).length)
                    {
                        update_t_surety_kolateral = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_surety_kolateral SET tipe_kolateral= :tipe_kolateral, pct_kolateral= :pct_kolateral, nilai_kolateral= :nilai_kolateral, jenis_kolateral= :jenis_kolateral, jenis_dokumen= :jenis_dokumen, no_dokumen= :no_dokumen, no_rekening= :no_rekening, jenis_pengikatan= :jenis_pengikatan, no_akte_pengikatan= :no_akte_pengikatan, tgl_awal_pengikatan= :tgl_awal_pengikatan, tgl_akhir_pengikatan=:tgl_akhir_pengikatan, tgl_terima_dokumen=:tgl_terima_dokumen, tgl_kembali_dokumen=:tgl_kembali_dokumen, keterangan=:keterangan, is_active= false, modified_by= :modified_by, modified_date= now() WHERE object_id= :object_id and no_dokumen = :no_dokumen returning *;", {
                            replacements: {object_id: get_policy_object[0].object_id, tipe_kolateral: body.dataKolateral[i].tipeKolateral, pct_kolateral: body.dataKolateral[i].pctKolateral, nilai_kolateral: body.dataKolateral[i].nilaiKolateral, jenis_kolateral: body.dataKolateral[i].jenisKolateral, jenis_dokumen: body.dataKolateral[i].jenisDokumen, no_dokumen: body.dataKolateral[i].noDokumen, no_rekening: body.dataKolateral[i].noRekening, jenis_pengikatan: body.dataKolateral[i].jenisPengikatan, no_akte_pengikatan: body.dataKolateral[i].noAktePengikatan, tgl_awal_pengikatan: body.dataKolateral[i].tglAwalPengikatan, tgl_akhir_pengikatan: body.dataKolateral[i].tglAkhirPengikatan, tgl_terima_dokumen: body.dataKolateral[i].tglTerimaDokumen, tgl_kembali_dokumen: body.dataKolateral[i].tglKembaliDokumen, keterangan: body.dataKolateral[i].keterangan, modified_by: user.username},
                            type: model.sequelize1.QueryTypes.UPDATE,
                            quoteIdentifiers: true, transaction: t})
                        
                        insert_t_surety_kolateral = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_surety_kolateral(id_agunan, object_id, tipe_kolateral, pct_kolateral, nilai_kolateral, jenis_kolateral, jenis_dokumen, no_dokumen, no_rekening, jenis_pengikatan, no_akte_pengikatan, tgl_awal_pengikatan, tgl_akhir_pengikatan, tgl_terima_dokumen, tgl_kembali_dokumen, keterangan, is_active, version, created_by, created_date, modified_by, modified_date)VALUES(uuid_generate_v4(), :object_id, :tipe_kolateral, :pct_kolateral, :nilai_kolateral, :jenis_kolateral, :jenis_dokumen, :no_dokumen, :no_rekening, :jenis_pengikatan, :no_akte_pengikatan, :tgl_awal_pengikatan, :tgl_akhir_pengikatan, :tgl_terima_dokumen, :tgl_kembali_dokumen, :keterangan, true, 0, :created_by, now(), null, null) returning *;", {
                            replacements: {object_id: get_policy_object[0].object_id, tipe_kolateral: body.dataKolateral[i].tipeKolateral, pct_kolateral: body.dataKolateral[i].pctKolateral, nilai_kolateral: body.dataKolateral[i].nilaiKolateral, jenis_kolateral: body.dataKolateral[i].jenisKolateral, jenis_dokumen: body.dataKolateral[i].jenisDokumen, no_dokumen: body.dataKolateral[i].noDokumen, no_rekening: body.dataKolateral[i].noRekening, jenis_pengikatan: body.dataKolateral[i].jenisPengikatan, no_akte_pengikatan: body.dataKolateral[i].noAktePengikatan, tgl_awal_pengikatan: body.dataKolateral[i].tglAwalPengikatan, tgl_akhir_pengikatan: body.dataKolateral[i].tglAkhirPengikatan, tgl_terima_dokumen: body.dataKolateral[i].tglTerimaDokumen, tgl_kembali_dokumen: body.dataKolateral[i].tglKembaliDokumen, keterangan: body.dataKolateral[i].keterangan, created_by: user.username},
                            type: model.sequelize1.QueryTypes.INSERT,
                            quoteIdentifiers: true, transaction: t})
                    }
                    else
                    {                        
                        insert_t_surety_kolateral = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_surety_kolateral(id_agunan, object_id, tipe_kolateral, pct_kolateral, nilai_kolateral, jenis_kolateral, jenis_dokumen, no_dokumen, no_rekening, jenis_pengikatan, no_akte_pengikatan, tgl_awal_pengikatan, tgl_akhir_pengikatan, tgl_terima_dokumen, tgl_kembali_dokumen, keterangan, is_active, version, created_by, created_date, modified_by, modified_date)VALUES(uuid_generate_v4(), :object_id, :tipe_kolateral, :pct_kolateral, :nilai_kolateral, :jenis_kolateral, :jenis_dokumen, :no_dokumen, :no_rekening, :jenis_pengikatan, :no_akte_pengikatan, :tgl_awal_pengikatan, :tgl_akhir_pengikatan, :tgl_terima_dokumen, :tgl_kembali_dokumen, :keterangan, true, 0, :created_by, now(), null, null) returning *;", {
                            replacements: {object_id: get_policy_object[0].object_id, tipe_kolateral: body.dataKolateral[i].tipeKolateral, pct_kolateral: body.dataKolateral[i].pctKolateral, nilai_kolateral: body.dataKolateral[i].nilaiKolateral, jenis_kolateral: body.dataKolateral[i].jenisKolateral, jenis_dokumen: body.dataKolateral[i].jenisDokumen, no_dokumen: body.dataKolateral[i].noDokumen, no_rekening: body.dataKolateral[i].noRekening, jenis_pengikatan: body.dataKolateral[i].jenisPengikatan, no_akte_pengikatan: body.dataKolateral[i].noAktePengikatan, tgl_awal_pengikatan: body.dataKolateral[i].tglAwalPengikatan, tgl_akhir_pengikatan: body.dataKolateral[i].tglAkhirPengikatan, tgl_terima_dokumen: body.dataKolateral[i].tglTerimaDokumen, tgl_kembali_dokumen: body.dataKolateral[i].tglKembaliDokumen, keterangan: body.dataKolateral[i].keterangan, created_by: user.username},
                            type: model.sequelize1.QueryTypes.INSERT,
                            quoteIdentifiers: true, transaction: t})
                    }
                }
            }
            if(body.idFile.length)
            {
                let get_policy_attachment = await model.sequelize1.query("select * from t_policy_attachmant where policy_id = :policy_id;", {
                    replacements: {policy_id: body.policyId},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                
                    if(get_policy_attachment.length)
                    {
                        for(let i = 0; i < body.jenisDokumen.length; i++)
                        {
                            get_policy_attachment = await model.sequelize1.query("select * from t_policy_attachmant where policy_id = :policy_id;", {
                                replacements: {policy_id: body.policyId},
                                type: model.sequelize1.QueryTypes.SELECT,
                                quoteIdentifiers: true, transaction: t})
                            if(get_policy_attachment.filter(value => value.jenis_dokumen == body.jenisDokumen[i]).length)
                            {
                                update_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update t_policy_attachmant set is_active = false, modified_by = :modified_by, modified_date = now() where jenis_dokumen = :jenis_dokumen and policy_id = :policy_id;", {
                                    replacements: {policy_id: body.policyId, jenis_dokumen: body.jenisDokumen[i], modified_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                                
                                insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(), :policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                    replacements: {policy_id: body.policyId, order_id: get_policy_attachment.filter(value => value.jenis_dokumen == body.jenisDokumen[i])[0].order_id, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                            }
                            else
                            {
                                get_max_urutan = await model.sequelize1.query("select max(order_id) as urutan from t_policy_attachmant where policy_id = :policy_id;", {
                                    replacements: {policy_id: body.policyId},
                                    type: model.sequelize1.QueryTypes.SELECT,
                                    quoteIdentifiers: true, transaction: t})
                                
                                insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(),:policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                    replacements: {policy_id: body.policyId, order_id: +get_max_urutan[0].urutan+1, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                            }
                        }
                    }
                    else
                    {
                        for(let i = 0; i<body.idFile.length; i++)
                        {
                            insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(), :policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                replacements: {policy_id: body.policyId, order_id: +i+1, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                    }
            }
            if(body.idStatus == 2)
            {
                body.disposisi.dokumentId = body.policyId
                body.disposisi.dokumentNo = get_policy[0].request_no
                body.idTipeDokumen = 301
                console.log(body)
                insert_disposisi = await approval_model.insertDisposisi(body.idTipeDokumen, body.policyId, body.idStatus, body.disposisi.disposisi, user.fullname);
                insert_tasklist = await approval_model.insertTaskList(body, user.username); 
            }
            else
            {
                body.disposisi.dokumentId = body.policyId
                body.disposisi.dokumentNo = get_policy[0].request_no
                body.idTipeDokumen = 301
                console.log(body)
                insert_tasklist = await approval_model.insertTaskList(body, user.username); 
            }
            
            return update_t_policy[0][0].policy_id
        })
    }
    catch(e)
    {
        console.log(e)
        throw new Error(e)
    }
}

exports.viewAkseptasiDoc = async function (file_id) {

    view_akseptasi_bp = await model.sequelize1.query("select * from t_file where file_id = :file_id;", {
        replacements: {file_id: file_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {view_akseptasi_bp: view_akseptasi_bp}
}

exports.getAkseptasiByPolicyId = async function (policy_id) {
    
    let get_policy = await model.sequelize1.query("select a.policy_id, a.nama_pinca, a.policy_no, d.nama_cabang, c.name as nama_produk, a.tgl_awal_pertanggungan, a.tgl_akhir_pertanggungan, b.principal_name, b.obligee_name, b.nama_proyek, b.alamat_proyek, b.nilai_proyek, b.nilai_jaminan, a.is_active from t_policy a, t_policy_object_surety b, m_product c, m_cabang d where a.id_cabang = d.id_cabang and a.product_id = c.product_id and a.policy_id = b.policy_id and a.policy_id = :policy_id and a.id_status = 3 and a.id_tipe_dokumen = 301", {
        replacements:{policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {get_policy: get_policy}
}