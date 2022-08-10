var request = require('request-promise');
var model = require('../models/index');
var approval_model = require('../models/approval_models/approval.js');
var dateFormat = require('dateformat');
const role = require('../privilege');
var https = require('https');
const { param } = require('../routes');
var fs = require('fs');
const { count } = require('console');
const jwt = require('jsonwebtoken');
var sha256 = require('js-sha256');
const nodemailer = require("nodemailer");
const { decode } = require('punycode');
const e = require('express');

createBilling = async function (params) {

    try
    {
        return await request({
            url: 'http://10.10.1.96:8080/api/payment/createBilling',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            json: params
        })
    }
    catch(err)
    {
        return {error: true, message: err.message}
    }
}

generateSertifikat = async function (params) {

    try
    {
        return await request({
            url: 'http://10.10.1.96:8006/api/v1/report/cetakSertifikat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'AVLj*t|K_{EWG!0nm@Be+(g`giDv?@'
            },
            json: params
        })
    }
    catch(err)
    {
        return {error: true, message: err.message}
    }
}

numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

readHTMLEmailVa = async function (customer_name, amount, bank, va_number, due_date, sppa, product_name, obligee_name, nama_proyek, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, nilai_jaminan) {
    return new Promise((resolve, reject) => {
        fs.readFile('../api_surety_online/views/va-page.html', 'utf8', function (err,data) {
            if (err) {
                resolve(console.log(err));
            }
            let user = data.replace(/@replace_customer/g, customer_name);
            user = user.replace(/@replace_amount/g, this.numberWithCommas(amount));
            user = user.replace(/@replace_bank/g, bank);
            user = user.replace(/@replace_va/g, va_number);
            user = user.replace(/@replace_sppa/g, sppa);
            user = user.replace(/@replace_product/g, product_name);
            user = user.replace(/@replace_obligee/g, obligee_name);
            user = user.replace(/@replace_proyek/g, nama_proyek);
            user = user.replace(/@replace_tgl_awal/g, tgl_awal_pertanggungan);
            user = user.replace(/@replace_tgl_akhir/g, tgl_akhir_pertanggungan);
            user = user.replace(/@replace_nilai_jaminan/g, this.numberWithCommas(nilai_jaminan));
            user = user.replace(/@replace_due/g, due_date);
                resolve(user)
            });
    })
}

readHTMLEmailVaCallback = async function (customer_name, amount, bank, va_number, policy_id, sppa, product_name, obligee_name, nama_proyek, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, nilai_jaminan) {
    return new Promise((resolve, reject) => {
        fs.readFile('../api_surety_online/views/va-page-notifications.html', 'utf8', function (err,data) {
            if (err) {
                resolve(console.log(err));
            }
            let user = data.replace(/@replace_customer/g, customer_name);
            user = user.replace(/@replace_amount/g, this.numberWithCommas(amount));
            user = user.replace(/@replace_bank/g, bank);
            user = user.replace(/@replace_va/g, va_number);
            user = user.replace(/@replace_sppa/g, sppa);
            user = user.replace(/@replace_product/g, product_name);
            user = user.replace(/@replace_obligee/g, obligee_name);
            user = user.replace(/@replace_proyek/g, nama_proyek);
            user = user.replace(/@replace_tgl_awal/g, tgl_awal_pertanggungan);
            user = user.replace(/@replace_tgl_akhir/g, tgl_akhir_pertanggungan);
            user = user.replace(/@replace_nilai_jaminan/g, this.numberWithCommas(nilai_jaminan));
            user = user.replace(/@replace_policy_id/g, policy_id);
                resolve(user)
            });
    })
}

readHTMLEmailReject = async function (customer_name, sppa, cabang) {
    return new Promise((resolve, reject) => {
        fs.readFile('../api_surety_online/views/notification-page-reject.html', 'utf8', function (err,data) {
            if (err) {
                resolve(console.log(err));
            }
            let user = data.replace(/@replace_customer/g, customer_name);
            user = user.replace(/@replace_sppa/g, sppa);
            user = user.replace(/@replace_cabang/g, cabang);
                resolve(user)
            });
    })
}

sendEmailVa = async function (customer_name, amount, bank, va_number, due_date, email, sppa, user, product_name, obligee_name, nama_proyek, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, nilai_jaminan) {
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
            subject: "Pembayaran VA Premi",
            html: await readHTMLEmailVa(customer_name, amount, bank, va_number, due_date, sppa, product_name, obligee_name, nama_proyek, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, nilai_jaminan)
        });
     
        console.log("Message sent: %s by "+user, info.messageId);
        return info.messageId;
    }
    catch(err)
    {
        console.log(err);
    }
}

sendEmailVaCallback = async function (customer_name, amount, bank, va_number, policy_id, email, sppa, product_name, obligee_name, nama_proyek, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, nilai_jaminan) {
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
            subject: "Pembayaran VA Terverifikasi",
            html: await readHTMLEmailVaCallback(customer_name, amount, bank, va_number, policy_id, sppa, product_name, obligee_name, nama_proyek, tgl_awal_pertanggungan, tgl_akhir_pertanggungan, nilai_jaminan)
        });
     
        console.log("Message sent: %s by "+email, info.messageId);
        return info.messageId;
    }
    catch(err)
    {
        console.log(err);
    }
}

sendEmailReject = async function (customer_name, sppa, cabang, email) {
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
            subject: "Pengajuan Akseptasi Ditolak ",
            html: await readHTMLEmailReject(customer_name, sppa, cabang)
        });
     
        console.log("Message sent: %s by "+email, info.messageId);
        return info.messageId;
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.getTransition = async function (req, res) {
    try
    {
        get_transition = await approval_model.getTransition(req.params.id_tipe_dokumen, req.params.status_dokumen)
        res.status(200).json({
            status: true,
            data: get_transition
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

exports.getUserTujuanDisposisi = async function (req, res) {
    try
    {
        let response
        get_user_tujuan_disposisi = await approval_model.getUserTujuanDisposisi(req.body.idTipeDokumen, req.body.statusAsal, req.body.statusTujuan, req.body.cabangPengajuan)
        if(req.body.isShowUserList == true)
        {
            response = get_user_tujuan_disposisi
        }
        else
        {
            response = get_user_tujuan_disposisi[0]
        }
        res.status(200).json({
            status: true,
            data: response
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

exports.getDisposisi = async function (req, res) {
    try
    {
        get_disposisi = await approval_model.getDisposisi(req.params.id_tipe_dokumen, req.params.id_user)
        res.status(200).json({
            status: true,
            data: get_disposisi
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

exports.insertDisposisi = async function (req, res) {
    try
    {
        insert_disposisi = await approval_model.insertDisposisi(req.body.idTipeDokumen, req.body.idUser, req.body.statusDokumen, req.body.logMessage, req.user.fullname)
        res.status(200).json({
            status: true,
            message: 'Disposisi added successfully',
            data: insert_disposisi
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

exports.updateStatusUser = async function (req, res) {
    try
    {
        let get_user = await approval_model.getUser(req.params.id_user)
        req.body.disposisi.dokumentId = req.params.id_user
        req.body.disposisi.dokumentNo = get_user[0].fullname
        update_status_user = await approval_model.updateStatusUser(req.params.id_user, req.body.idStatus, req.user.username)
        insert_disposisi = await approval_model.insertDisposisi(req.body.idTipeDokumen, req.params.id_user, req.body.idStatus, req.body.disposisi.disposisi, req.user.fullname);
        insert_tasklist = await approval_model.insertTaskList(req.body, req.user.username);
        res.status(200).json({
            status: true,
            message: "Success"
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

exports.generateKey = async function (req, res) {
    let get_policy = await approval_model.getPolicyEmail(req.body.policy_id)
    let get_policy_premium = await approval_model.getPolicyPremium(req.body.policy_id)

    let type
    if(get_policy[0].id_jenis_pembayaran = 'mandiri')
    {
        type = '002'
    }
    else
    {
        type = '001'
    }

    var expire_date = new Date()
    expire_date.setDate(expire_date.getDate() + 1)
    expire_date.setHours(23, 59, 59, 999)

    let sha256_key = sha256('2CWY{5a=6s+\\j/{m').toUpperCase()
    let client_id = '06'
    let request_date = dateFormat(new Date(), "yyyymmddHHMMss" )
    let transaction_id = get_policy[0].request_no.substring(4,14)
    let key = sha256('#'+request_date+'#'+transaction_id+'#'+sha256_key+'#'+client_id+'#'+type+'#')
    let no_polis = ''
    let trx_amount = ''+(parseInt(get_policy_premium[0].premi) + parseInt(get_policy_premium[0].biaya_polis) + parseInt(get_policy_premium[0].biaya_materai))
    let customer_name = get_policy[0].customer_name
    let customer_email = get_policy[0].created_by
    let customer_phone = ''
    let expired_datetime = dateFormat(expire_date, "yyyymmddHHMMss" )
    let description = ''

    let json_request = {
        client_id: client_id,
        type: type,
        transaction_id: transaction_id,
        request_date: request_date,
        key: key,
        data:{
            no_polis: no_polis,
            trx_amount: trx_amount,
            customer_name: customer_name,
            customer_email: customer_email,
            customer_phone: customer_phone,
            expired_datetime: expired_datetime,
            description: description
        }        
    }
    console.log(json_request)
    let va_number = await this.createBilling(json_request)
    // await approval_model.updateNoVa(req.params.policy_id, va_number.data.virtual_account)
    let due_date = dateFormat(new Date(va_number.data.datetime_expired.substring(0,4)+'-'+va_number.data.datetime_expired.substring(4,6)+'-'+va_number.data.datetime_expired.substring(6,8)+'T'+va_number.data.datetime_expired.substring(8,10)+':'+va_number.data.datetime_expired.substring(10,12)+':'+va_number.data.datetime_expired.substring(12,14)), "yyyy-mm-dd HH:MM" )
    this.sendEmailVa(customer_name, trx_amount, get_policy[0].id_jenis_pembayaran.toUpperCase(), va_number.data.virtual_account, due_date, get_policy[0].created_by, get_policy[0].request_no, 'user', get_policy[0].product_name, get_policy[0].obligee_name, get_policy[0].nama_proyek, get_policy[0].tgl_awal_pertanggungan, get_policy[0].tgl_akhir_pertanggungan, parseInt(get_policy[0].nilai_jaminan))
    console.log(va_number)
    res.json(va_number)
}

exports.updateStatusAkseptasi = async function (req, res) {
    try
    {
        let get_policy = await approval_model.getPolicyEmail(req.params.policy_id)
        let get_policy_premium = await approval_model.getPolicyPremium(req.params.policy_id)

        req.body.disposisi.dokumentId = req.params.policy_id
        req.body.disposisi.dokumentNo = get_policy[0].request_no
        if(!req.body.tglTerbit || !req.body.idBp || !req.body.customerId)
        {
            update_status_policy = await approval_model.updateStatusAkseptasi(req.params.policy_id, req.body.disposisi.statusDokumen,req.user.fullname)
        }
        else
        {
            update_status_policy = await approval_model.updateStatusAkseptasi(req.params.policy_id, req.body.disposisi.statusDokumen,req.user.fullname, req.body.tglTerbit, req.body.idBp, req.body.customerId, req.body.hariDaluarsa, req.body.rekomendasiKeputusan, req.body, req.user)
        }

        await approval_model.insertDisposisi(req.body.idTipeDokumen, req.params.policy_id, req.body.idStatus, req.body.disposisi.disposisi, req.user.fullname);
        await approval_model.insertTaskList(req.body, req.user.username);

        if(req.body.disposisi.statusDokumen == 5)
        {
            let type
            if(get_policy[0].id_jenis_pembayaran = 'mandiri')
            {
                type = '002'
            }
            else
            {
                type = '001'
            }

            var expire_date = new Date()
            expire_date.setDate(expire_date.getDate() + 1)
            expire_date.setHours(23, 59, 59, 999)

            let sha256_key = sha256('2CWY{5a=6s+\\j/{m').toUpperCase()
            let client_id = '06'
            let request_date = dateFormat(new Date(), "yyyymmddHHMMss" )
            let transaction_id = get_policy[0].request_no.substring(4,14)
            let key = sha256('#'+request_date+'#'+transaction_id+'#'+sha256_key+'#'+client_id+'#'+type+'#')
            let no_polis = ''
            let trx_amount = +parseInt(get_policy_premium[0].premi) + parseInt(get_policy_premium[0].biaya_polis) + parseInt(get_policy_premium[0].biaya_materai)
            let customer_name = get_policy[0].customer_name
            let customer_email = get_policy[0].created_by
            let customer_phone = ''
            let expired_datetime = dateFormat(expire_date, "yyyymmddHHMMss" )
            let description = ''

            let json_request = {
                client_id: client_id,
                type: type,
                transaction_id: transaction_id,
                request_date: request_date,
                key: key,
                data:{
                    no_polis: no_polis,
                    trx_amount: trx_amount,
                    customer_name: customer_name,
                    customer_email: customer_email,
                    customer_phone: customer_phone,
                    expired_datetime: expired_datetime,
                    description: description
                }        
            }
            let va_number = await this.createBilling(json_request)
            console.log(va_number)
            let va_expired_date = new Date(va_number.data.datetime_expired.substring(0,4)+'-'+va_number.data.datetime_expired.substring(4,6)+'-'+va_number.data.datetime_expired.substring(6,8)+'T'+va_number.data.datetime_expired.substring(8,10)+':'+va_number.data.datetime_expired.substring(10,12)+':'+va_number.data.datetime_expired.substring(12,14))
            await approval_model.updateNoVa(req.params.policy_id, va_number.data.virtual_account, va_expired_date)
            let due_date = dateFormat(new Date(va_number.data.datetime_expired.substring(0,4)+'-'+va_number.data.datetime_expired.substring(4,6)+'-'+va_number.data.datetime_expired.substring(6,8)+'T'+va_number.data.datetime_expired.substring(8,10)+':'+va_number.data.datetime_expired.substring(10,12)+':'+va_number.data.datetime_expired.substring(12,14)), "yyyy-mm-dd HH:MM" )
            this.sendEmailVa(customer_name, trx_amount, get_policy[0].id_jenis_pembayaran.toUpperCase(), va_number.data.virtual_account, due_date, get_policy[0].created_by, get_policy[0].request_no, 'user', get_policy[0].product_name, get_policy[0].obligee_name, get_policy[0].nama_proyek, get_policy[0].tgl_awal_pertanggungan, get_policy[0].tgl_akhir_pertanggungan, parseInt(get_policy[0].nilai_jaminan))
        }
        else if(req.body.disposisi.statusDokumen == 4)
        {
            let get_cabang = await approval_model.getNamaCabang(req.params.policy_id)
            console.log(get_cabang)
            this.sendEmailReject(get_policy[0].customer_name, get_policy[0].request_no, get_cabang[0].nama_cabang, get_policy[0].created_by)
        }
        res.status(200).json({
            status: true,
            message: "Success"
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

exports.callbackVa = async function (req, res) {
    try
    {
        let get_polis = await approval_model.getPolicyByVa(req.body.data.virtual_account)
        if(!get_polis.length)
        {
            return res.status(200).json({
                status: '006',
                message: 'Invalid VA Number'
            })
        }
        else
        {
            if(get_polis[0].policy_no && get_polis[0].policy_no != '')
            {
                return res.status(200).json({
                    status: '102',
                    message: 'VA Number is in use'
                })
            }
            else
            {
                let premi = await approval_model.getPolicyPremium(get_polis[0].policy_id)
                let no_sertifikat = await approval_model.getNoPolis(get_polis[0].product_id, get_polis[0].id_cabang)
                let update = await approval_model.updateTerbitSertifikat(get_polis[0].policy_id, no_sertifikat, get_polis[0].request_no, req.body.data.payment_date, req.body.data.trx_amount)
                this.sendEmailVaCallback(get_polis[0].customer_name, +parseInt(premi[0].premi) + parseInt(premi[0].biaya_polis) + parseInt(premi[0].biaya_materai), get_polis[0].id_jenis_pembayaran.toUpperCase(), get_polis[0].va_number, get_polis[0].policy_id, get_polis[0].created_by, get_polis[0].request_no, get_polis[0].product_name, get_polis[0].obligee_name, get_polis[0].nama_proyek, get_polis[0].tgl_awal_pertanggungan, get_polis[0].tgl_akhir_pertanggungan, parseInt(get_polis[0].nilai_jaminan))
                res.status(200).json({
                    status: '000',
                    message: 'Success',
                    data: {
                        policy_no: no_sertifikat,
                        va_number: update[0].va_number
                    }
                })
            }
        }
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: '008',
            message: 'Technical Failure'
        })
    }
}

exports.downloadSertifikat = async function (req, res) {
    try
    {
        let get_polis = await approval_model.getPolicy(req.params.policy_id)
        if(!get_polis.length)
        {
            res.setHeader('Content-Type', 'text/html');
            res.status(400).send('<h1>Data polis surety bond tidak dapat ditemukan!</h1>');
        }
        else
        {
            sertif_params = {
                policyId: req.params.policy_id,
                noDokumen: get_polis[0].request_no,
                kodeCabang: get_polis[0].id_cabang,
                idTemplate: get_polis[0].id_template_sertifikat
            }
            let sertifikat = await this.generateSertifikat(sertif_params)
            if(!sertifikat.data)
            {
                console.log(sertifikat)
                res.setHeader('Content-Type', 'text/html');
                res.status(400).send('<h1>Internal Server Error</h1>');
            }
            else
            {
                const download = Buffer.from(sertifikat.data.file, 'base64');
                res.setHeader('Content-disposition', 'inline; filename="akseptasi-'+get_polis[0].policy_no+'.pdf"');
                res.setHeader('Content-type', 'application/pdf');
                res.end(download);
            }
        }
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({
            status: false,
            message: 'Internal server error'
        })
    }
}

exports.insertTaskList = async function (req, res) {
    try
    {
        get_task_list = await approval_model.getTaskList(req.body.dokumenId, req.body.idUser)
        if(!get_task_list.length)
        {
            insert_task_list = await approval_model.insertTaskList(req.body, req.user.username)
            insert_task_list_detail = await approval_model.insertTaskListDetail(req.body, insert_task_list[0].task_id, req.user.username)
        }
        else if(get_task_list.length && req.body.isTaskListDone == true)
        {
            req.body.endTask = new Date();
            insert_task_list = await approval_model.updateTaskList(req.body, req.user.username)
            insert_task_list_detail = await approval_model.insertTaskListDetail(req.body, insert_task_list[0].task_id, req.user.username)
        }
        res.status(200).json({
            status: true,
            message: 'Disposisi added successfully',
            data: insert_task_list
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