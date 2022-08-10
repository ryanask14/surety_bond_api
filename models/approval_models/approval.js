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

function padWithZeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

exports.getNamaCabang = async function (policy_id) {
    let get_cabang = await model.sequelize1.query("select b.* from t_policy a, m_cabang b where a.id_cabang = b.id_cabang and b.is_active = true and a.policy_id = :policy_id;", {
        replacements: {policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_cabang
}

exports.insertDisposisi = async function (id_tipe_dokumen, dokumen_id, status_dokumen, log_message, fullname) {
    try
    {
        return await model.sequelize1.transaction(async (t) => {
            insert_disposisi = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.t_dokumen_disposisi(disposisi_id, id_tipe_dokumen, dokumen_id, status_dokumen, log_message, user_full_name, created_date)VALUES(uuid_generate_v4(), :id_tipe_dokumen, :dokumen_id, :status_dokumen, :log_message, :user_full_name, now()) returning *;", {
                replacements: {id_tipe_dokumen: id_tipe_dokumen, dokumen_id: dokumen_id, status_dokumen: status_dokumen, log_message: log_message, user_full_name: fullname},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})
                return insert_disposisi
    })
    }
    catch(e)
    {
        throw new Error(e)
    }    
}

exports.getDisposisi = async function (id_tipe_dokumen, dokumen_id) {
    get_disposisi = await model.sequelize1.query("select * from t_dokumen_disposisi where id_tipe_dokumen = :id_tipe_dokumen and dokumen_id = :dokumen_id order by created_date desc;", {
        replacements: {id_tipe_dokumen: id_tipe_dokumen, dokumen_id: dokumen_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_disposisi
}

exports.getTaskListDetail = async function (task_id) {
    get_disposisi = await model.sequelize1.query("SELECT * FROM t_task_list_detail WHERE task_id = :task_id AND end_task IS NULL;", {
        replacements: {task_id: task_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_disposisi
}

exports.getUser = async function (id_user) {
    let get_user = await model.sequelize1.query("select * from m_user where id_user = :id_user", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_user
}

exports.updateStatusUser = async function (id_user, status_dokumen, username) {
    let query_string
    let params
    if(status_dokumen == 5 || status_dokumen == 4)
    {
        query_string = "SET TIMEZONE='Asia/Bangkok'; update m_user set is_need_approval = false, id_status = :status_dokumen, modified_by = :username, modified_date = now() where id_user = :id_user;"
    }
    else
    {
        query_string = "SET TIMEZONE='Asia/Bangkok'; update m_user set id_status = :status_dokumen, modified_by = :username, modified_date = now() where id_user = :id_user;"
    }
    update_status = await model.sequelize1.query(query_string, {
        replacements: {id_user: id_user, status_dokumen: status_dokumen, username: username},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    return update_status
}

exports.updateStatusAkseptasi = async function (policy_id, status_dokumen, username, tgl_terbit = null, id_bp = null, customer_id = null, hari_daluarsa = null, rekomendasi_keputusan = null, file = null, user = null) {
    try
    {
        return await model.sequelize1.transaction(async (t) => {

            let tgl_daluarsa
            let get_policy = await model.sequelize1.query("SELECT * FROM t_policy where policy_id = :policy_id;", {
                replacements: {policy_id: policy_id},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            let update_status_t_policy = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy set id_status = :status_dokumen, modified_by = :username, modified_date = now() where policy_id = :policy_id returning *;", {
                replacements: {policy_id: policy_id, status_dokumen: status_dokumen, username: username},
                type: model.sequelize1.QueryTypes.UPDATE,
                quoteIdentifiers: true, transaction: t})

            if(get_policy[0].id_status == 2 && status_dokumen == 6)
            {
                if(hari_daluarsa)
                {
                    var date = new Date(get_policy[0].tgl_akhir_pertanggungan)
                    date.setDate(+date.getDate() + hari_daluarsa)
                    tgl_daluarsa = date
                }
                else
                {
                    hari_daluarsa = null
                    tgl_daluarsa = null
                }

                if(file.tglJatuhTempo && file.tglJatuhTempo != '')
                {
                    let update_t_policy_premiun = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy_invoice_premium set tgl_jatuh_tempo = :tgl_jatuh_tempo where policy_id = :policy_id;", {
                        replacements: {policy_id: policy_id, tgl_jatuh_tempo: file.tglJatuhTempo},
                        type: model.sequelize1.QueryTypes.UPDATE,
                        quoteIdentifiers: true, transaction: t})
                }

                update_status_t_policy = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy set tgl_terbit = :tgl_terbit, customer_id = :customer_id where policy_id = :policy_id returning *;", {
                    replacements: {policy_id: policy_id, customer_id: customer_id, tgl_terbit: tgl_terbit},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})

                update_status_policy_object_surety = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy_object_surety set hari_daluarsa_klaim= :hari_daluarsa, tgl_daluarsa_klaim = :tgl_daluarsa, rekomdendasi_keputusan = :rekomendasi_keputusan, obligee_id = :id_bp, principal_id = :customer_id, modified_by = :username, modified_date = now() where policy_id = :policy_id;", {
                    replacements: {policy_id: policy_id, customer_id: customer_id, id_bp: id_bp, status_dokumen: status_dokumen, hari_daluarsa: hari_daluarsa, tgl_daluarsa: tgl_daluarsa, username: username, rekomendasi_keputusan: rekomendasi_keputusan},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})

                if(file.idFile.length)
                {
                    get_policy_attachment = await model.sequelize1.query("select * from t_policy_attachmant where policy_id = :policy_id and is_active = true;", {
                        replacements: {policy_id: policy_id},
                        type: model.sequelize1.QueryTypes.SELECT,
                        quoteIdentifiers: true, transaction: t})
                    
                        if(get_policy_attachment.length)
                        {
                            for(let i = 0; i < file.jenisDokumen.length; i++)
                            {
                                get_policy_attachment = await model.sequelize1.query("select * from t_policy_attachmant where policy_id = :policy_id and is_active = true;", {
                                    replacements: {policy_id: policy_id},
                                    type: model.sequelize1.QueryTypes.SELECT,
                                    quoteIdentifiers: true, transaction: t})
                                    
                                if(get_policy_attachment.filter(value => value.jenis_dokumen == file.jenisDokumen[i]).length)
                                {
                                    update_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update t_policy_attachmant set is_active = false, modified_by = :modified_by, modified_date = now() where jenis_dokumen = :jenis_dokumen and policy_id = :policy_id;", {
                                        replacements: {policy_id: policy_id, jenis_dokumen: file.jenisDokumen[i], modified_by: user.username},
                                        type: model.sequelize1.QueryTypes.INSERT,
                                        quoteIdentifiers: true, transaction: t})
                                    
                                    insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(), :policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                        replacements: {policy_id: policy_id, order_id: get_policy_attachment.filter(value => value.jenis_dokumen == file.jenisDokumen[i])[0].order_id, json_data: JSON.stringify({jenisDokumen: file.jenisDokumen[i], nomorDokumen: file.nomorDokumen[i], tglDokumen: file.tglDokumen[i], tempat: file.tempat[i], keteranganDokumen: file.keteranganDokumen[i]}), file_id: file.idFile[i], jenis_dokumen: file.jenisDokumen[i], created_by: user.username},
                                        type: model.sequelize1.QueryTypes.INSERT,
                                        quoteIdentifiers: true, transaction: t})
                                }
                                else
                                {
                                    get_max_urutan = await model.sequelize1.query("select max(order_id) as urutan from t_policy_attachmant where policy_id = :policy_id;", {
                                        replacements: {policy_id: policy_id},
                                        type: model.sequelize1.QueryTypes.SELECT,
                                        quoteIdentifiers: true, transaction: t})
                                    
                                    insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.t_policy_attachmant(attachment_id, policy_id, order_id, json_data, file_id, is_active, version, created_by, created_date, jenis_dokumen)VALUES(uuid_generate_v4(),:policy_id, :order_id, :json_data, :file_id, true, 0, :created_by, now(), :jenis_dokumen);", {
                                        replacements: {policy_id: policy_id, order_id: +get_max_urutan[0].urutan+1, json_data: JSON.stringify({jenisDokumen: file.jenisDokumen[i], nomorDokumen: file.nomorDokumen[i], tglDokumen: file.tglDokumen[i], tempat: file.tempat[i], keteranganDokumen: file.keteranganDokumen[i]}), file_id: file.idFile[i], jenis_dokumen: file.jenisDokumen[i], created_by: user.username},
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
                                    replacements: {policy_id: policy_id, order_id: +i+1, json_data: JSON.stringify({jenisDokumen: body.jenisDokumen[i], nomorDokumen: body.nomorDokumen[i], tglDokumen: body.tglDokumen[i], tempat: body.tempat[i], keteranganDokumen: body.keteranganDokumen[i]}), file_id: body.idFile[i], jenis_dokumen: body.jenisDokumen[i], created_by: user.username},
                                    type: model.sequelize1.QueryTypes.INSERT,
                                    quoteIdentifiers: true, transaction: t})
                            }
                        }
                }
            }
            else if(get_policy[0].id_status == 2 && status_dokumen == 1)
            {
                if(hari_daluarsa)
                {
                    var date = new Date(get_policy[0].tgl_akhir_pertanggungan)
                    date.setDate(+date.getDate() + hari_daluarsa)
                    tgl_daluarsa = date
                }
                else
                {
                    hari_daluarsa = null
                    tgl_daluarsa = null
                }

                update_status_t_policy = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy set tgl_terbit = :tgl_terbit, customer_id = :customer_id where policy_id = :policy_id returning *;", {
                    replacements: {policy_id: policy_id, customer_id: customer_id, tgl_terbit: tgl_terbit},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})

                update_status_policy_object_surety = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update t_policy_object_surety set obligee_id = :id_bp, principal_id = :customer_id, modified_by = :username, modified_date = now() where policy_id = :policy_id;", {
                    replacements: {policy_id: policy_id, customer_id: customer_id, id_bp: id_bp, status_dokumen: status_dokumen, hari_daluarsa: hari_daluarsa, username: username},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})
            }

            return update_status_t_policy
        })
    }
    catch(e)
    {
        console.log(e)
        throw new Error(e)
    }
}

exports.getUserTujuanDisposisi = async function (id_tipe_dokumen, status_asal, status_tujuan, cabang_pengajuan) {
    get_tujuan_disposisi = await model.sequelize1.query("SELECT transisi.transition_id, muser.id_user, muser.fullname, user_role.role_name, transisi.is_to_pusat, transisi.is_show_user_list, COALESCE(COUNT(task.task_id), 0) AS jml_task FROM m_transition transisi INNER JOIN r_user_roles user_role ON transisi.to_role = user_role.role_name INNER JOIN m_user muser ON muser.id_user = user_role.id_user LEFT JOIN t_task_list task ON task.id_user = muser.id_user AND task.is_task_list_done = false WHERE transisi.id_tipe_dokumen = :id_tipe_dokumen AND transisi.from_doc_status = :status_asal AND transisi.to_doc_status = :status_tujuan AND CASE WHEN transisi.is_to_pusat THEN muser.id_cabang = muser.id_cabang ELSE muser.id_cabang = :cabang_pengajuan END GROUP BY transisi.transition_id, muser.id_user, muser.fullname, user_role.role_name, transisi.is_to_pusat, transisi.is_show_user_list ORDER BY COALESCE(COUNT(task.task_id), 0)", {
        replacements: {id_tipe_dokumen: id_tipe_dokumen, status_asal: status_asal, status_tujuan: status_tujuan, cabang_pengajuan: cabang_pengajuan},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_tujuan_disposisi
}

exports.getTransition = async function (id_tipe_dokumen, status_dokumen) {
    get_transition = await model.sequelize1.query("SELECT * FROM m_transition WHERE id_tipe_dokumen = :id_tipe_dokumen AND from_doc_status = :status_dokumen order by ordering", {
        replacements: {id_tipe_dokumen: id_tipe_dokumen, status_dokumen: status_dokumen},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_transition
}

exports.getTaskList = async function (dokument_id) {
    get_task_list = await model.sequelize1.query("SELECT * FROM t_task_list WHERE dokument_id = :dokument_id and is_task_list_done = false", {
        replacements: {dokument_id: dokument_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_task_list
}

exports.insertTaskList = async function (user, created_by) {
    try
    {
        return await model.sequelize1.transaction(async (t) => {

            get_task_list = await this.getTaskList(user.disposisi.dokumentId)
            
            let insert_tasklist
            if(!get_task_list.length)
            {
                insert_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.t_task_list(task_id, id_tipe_dokumen, id_user_prev, role_name_prev, id_user, role_name, transition_id, status_dokumen, dokument_id, dokument_no, is_task_list_done, start_task, end_task, millisecond_diff, description, version, created_by, created_date) VALUES(uuid_generate_v4(), :id_tipe_dokumen, :id_user_prev, :role_name_prev, :id_user, :role_name, :transition_id, :status_dokumen, :dokument_id, :dokument_no, :is_task_list_done, now(), null, null, :description, 0, :created_by, now()) returning *;", {
                    replacements: {id_tipe_dokumen: user.idTipeDokumen, id_user_prev: user.disposisi.idUserPrev, role_name_prev: user.disposisi.roleNamePrev, id_user: user.disposisi.idUser, role_name: user.disposisi.roleName, transition_id: user.disposisi.transitionId, status_dokumen: user.disposisi.statusDokumen, dokument_id: user.disposisi.dokumentId, dokument_no: user.disposisi.dokumentNo, is_task_list_done: user.disposisi.isTaskListDone, description: user.disposisi.description, created_by: created_by},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t})

                insert_tasklist_detail = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.t_task_list_detail(task_detail_id, task_id, id_user_prev, role_name_prev, id_user, role_name, transition_id, status_dokumen, start_task, end_task, millisecond_diff, is_active, version, created_by, created_date) VALUES(uuid_generate_v4(), :task_id, :id_user_prev, :role_name_prev, :id_user, :role_name, :transition_id, :status_dokumen, :start_task, null, null, true, 0, :created_by, now()) returning *;", {
                    replacements: {task_id: insert_tasklist[0][0].task_id, id_user_prev: user.disposisi.idUserPrev, role_name_prev: user.disposisi.roleNamePrev, id_user: user.disposisi.idUser, role_name: user.disposisi.roleName, transition_id: user.disposisi.transitionId, status_dokumen: user.disposisi.statusDokumen, start_task: new Date(), created_by: created_by},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t})
            }
            else
            {
                let millisecond_diff
                let end_task
                if(user.disposisi.isTaskListDone == true)
                {
                    millisecond_diff = new Date() - new Date(get_task_list[0].start_task)
                    end_task = new Date()
                }
                else
                {
                    millisecond_diff = null
                    end_task = null
                }    
                get_task_list_detail = await this.getTaskListDetail(get_task_list[0].task_id)
                
                if(get_task_list_detail[0].status_dokumen == 2 && user.disposisi.statusDokumen == 1)
                {
                    user.disposisi.idUser = get_task_list_detail[0].id_user_prev
                    user.disposisi.idUserPrev = get_task_list_detail[0].id_user
                    user.disposisi.roleNamePrev = get_task_list_detail[0].role_name
                    user.disposisi.roleName = get_task_list_detail[0].role_name_prev
                }
                else if(get_task_list_detail[0].status_dokumen == 6 && user.disposisi.statusDokumen == 2)
                {
                    user.disposisi.idUser = get_task_list_detail[0].id_user_prev
                    user.disposisi.idUserPrev = get_task_list_detail[0].id_user
                    user.disposisi.roleNamePrev = get_task_list_detail[0].role_name
                    user.disposisi.roleName = get_task_list_detail[0].role_name_prev
                }
                else if(get_task_list_detail[0].status_dokumen == 6 && user.disposisi.statusDokumen == 1)
                {
                    user.disposisi.idUser = get_task_list_detail[0].id_user_prev
                    user.disposisi.idUserPrev = get_task_list_detail[0].id_user
                    user.disposisi.roleNamePrev = get_task_list_detail[0].role_name
                    user.disposisi.roleName = get_task_list_detail[0].role_name_prev
                }

                insert_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_task_list SET id_user = :id_user, role_name = :role_name, transition_id = :transition_id, status_dokumen = :status_dokumen, is_task_list_done = :is_task_list_done, end_task=:end_task, millisecond_diff = :millisecond_diff, version=:version, modified_by=:modified_by, modified_date=now() WHERE task_id = :task_id returning *;", {
                    replacements: {task_id: get_task_list[0].task_id, /*id_user_prev: user.disposisi.idUserPrev, role_name_prev: user.disposisi.roleNamePrev,*/ id_user: user.disposisi.idUser, role_name: user.disposisi.roleName, transition_id: user.disposisi.transitionId, status_dokumen: user.disposisi.statusDokumen, is_task_list_done: user.disposisi.isTaskListDone, end_task: end_task, millisecond_diff: millisecond_diff, version: +get_task_list[0].version+1, modified_by: created_by},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})

                update_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_task_list_detail SET end_task=:end_task, millisecond_diff=:millisecond_diff, version=:version, modified_by=:modified_by, modified_date=now() WHERE task_detail_id=:task_detail_id;", {
                    replacements: {task_detail_id: get_task_list_detail[0].task_detail_id, end_task: new Date(), millisecond_diff: new Date() - new Date(get_task_list_detail[0].start_task), version: +get_task_list_detail[0].version+1, modified_by: created_by},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})

                if(user.disposisi.isTaskListDone == false)
                {
                    insert_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.t_task_list_detail(task_detail_id, task_id, id_user_prev, role_name_prev, id_user, role_name, transition_id, status_dokumen, start_task, end_task, millisecond_diff, is_active, version, created_by, created_date) VALUES(uuid_generate_v4(), :task_id, :id_user_prev, :role_name_prev, :id_user, :role_name, :transition_id, :status_dokumen, :start_task, null, null, true, 0, :created_by, now()) returning *;", {
                        replacements: {task_id: get_task_list[0].task_id, id_user_prev: user.disposisi.idUserPrev, role_name_prev: user.disposisi.roleNamePrev, id_user: user.disposisi.idUser, role_name: user.disposisi.roleName, transition_id: user.disposisi.transitionId, status_dokumen: user.disposisi.statusDokumen, start_task: new Date(), created_by: created_by},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t})
                }
                else if(user.disposisi.isTaskListDone == true)
                {
                    insert_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.t_task_list_detail(task_detail_id, task_id, id_user_prev, role_name_prev, id_user, role_name, transition_id, status_dokumen, start_task, end_task, millisecond_diff, is_active, version, created_by, created_date) VALUES(uuid_generate_v4(), :task_id, :id_user_prev, :role_name_prev, :id_user, :role_name, :transition_id, :status_dokumen, :start_task, null, null, true, 0, :created_by, now()) returning *;", {
                        replacements: {task_id: get_task_list[0].task_id, id_user_prev: user.disposisi.idUserPrev, role_name_prev: user.disposisi.roleNamePrev, id_user: user.disposisi.idUser, role_name: user.disposisi.roleName, transition_id: user.disposisi.transitionId, status_dokumen: user.disposisi.statusDokumen, start_task: new Date(), created_by: created_by},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t})
                    update_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_task_list_detail SET end_task=:end_task, millisecond_diff=:millisecond_diff, version=:version, modified_by=:modified_by, modified_date=now() WHERE task_detail_id=:task_detail_id;", {
                        replacements: {task_detail_id: insert_tasklist[0][0].task_detail_id, end_task: new Date(), millisecond_diff: new Date() - new Date(insert_tasklist[0][0].start_task), version: +insert_tasklist[0][0].version+1, modified_by: created_by},
                        type: model.sequelize1.QueryTypes.UPDATE,
                        quoteIdentifiers: true, transaction: t})
                }
            }
            return insert_tasklist
        })
    }
    catch(e)
    {
        console.log(e)
        throw new Error(e)
        
    }
}

exports.updateTaskList = async function (user, modified_by) {
    get_task_list = await this.getTaskList(user.dokumenId)
    let millisecond_diff
    if(user.isTaskListDone == true)
    {
        millisecond_diff = new Date() - new Date(gen_task_list[0].start_task)
    }
    else
    {
        millisecond_diff = null
    }    

    update_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_task_list SET id_user_prev = :id_user_prev, role_name_prev = :role_name_prev, id_user = :id_user, role_name = :role_name, transition_id = :transition_id, status_dokumen = :status_dokumen, is_task_list_done = :is_task_list_done, end_task=:end_task, millisecond_diff = :millisecond_diff, version=:version, modified_by=:modified_by, modified_date=now() WHERE task_id = :task_id returning *;", {
        replacements: {task_id: gen_task_list[0].task_id, id_user_prev: gen_task_list[0].id_user, role_name_prev: gen_task_list[0].role_name, id_user: user.idUser, role_name: user.roleName, transition_id: user.transitionId, status_dokumen: user.statusDokumen, is_task_list_done: user.isTaskListDone, end_task: user.endTask, millisecond_diff: millisecond_diff, version: +get_task_list[0].version+1, modified_by: modified_by},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    return update_tasklist
}

exports.getPolicy = async function (policy_id) {
    get_policy = await model.sequelize1.query("select * from t_policy where policy_id = :policy_id", {
        replacements: {policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_policy
}

exports.getPolicyEmail = async function (policy_id) {
    let get_policy = await model.sequelize1.query("select a.*, b.name as product_name, c.obligee_name, c.nama_proyek, c.nilai_jaminan from t_policy a, m_product b, t_policy_object_surety c where a.policy_id = c.policy_id and a.product_id = b.product_id and a.policy_id = :policy_id", {
        replacements: {policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_policy
}

exports.getPolicyByVa = async function (va_number) {
    let get_policy_va = await model.sequelize1.query("select a.*, b.name as product_name, c.obligee_name, c.nama_proyek, c.nilai_jaminan from t_policy a, m_product b, t_policy_object_surety c where a.policy_id = c.policy_id and a.product_id = b.product_id and a.va_number = :va_number", {
        replacements: {va_number: va_number},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_policy_va
}

exports.updateTerbitSertifikat = async function (policy_id, no_sertifikat, request_no, tgl_bayar, jml_bayar) {
    let query_premium
    let get_policy_premium = await model.sequelize1.query("select * from t_policy_invoice_premium where policy_id = :policy_id", {
        replacements: {invoice_no: 'INV'+request_no, tgl_bayar: tgl_bayar.substring(0,8), jml_bayar: jml_bayar, policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    if(!get_policy_premium[0].tgl_jatuh_tempo)
    {
        query_premium = "update t_policy_invoice_premium set invoice_no = :invoice_no, tgl_jatuh_tempo = now() + interval '30' day, invoice_date = now(), is_lunas = true, tgl_bayar = :tgl_bayar, jml_bayar = :jml_bayar where policy_id = :policy_id"
    }
    else
    {
        query_premium = "update t_policy_invoice_premium set invoice_no = :invoice_no, invoice_date = now(), is_lunas = true, tgl_bayar = :tgl_bayar, jml_bayar = :jml_bayar where policy_id = :policy_id"
    }

    let update_policy = await model.sequelize1.query("update t_policy set posting_date = now(), policy_no = :no_sertifikat, id_status = 3 where policy_id = :policy_id returning *;", {
        replacements: {policy_id: policy_id, no_sertifikat: no_sertifikat},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    let update_policy_premium = await model.sequelize1.query(query_premium, {
        replacements: {invoice_no: 'INV'+request_no, tgl_bayar: tgl_bayar.substring(0,8), jml_bayar: jml_bayar, policy_id: policy_id},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    return update_policy
}

exports.getPolicyPremium = async function (policy_id) {
    get_policy_premium = await model.sequelize1.query("select * from t_policy_invoice_premium where policy_id = :policy_id", {
        replacements: {policy_id: policy_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_policy_premium
}

exports.insertTaskListDetail = async function (user, task_id, created_by) {
    get_task_list_detail = await this.getTaskListDetail(user.dokumenId)
    let insert_tasklist
    if(get_task_list_detail[0].status_dokumen == 2 && user.statusDokumen == 1)
    {
        user.idUser = get_task_list_detail[0].id_user_prev
        user.idUserPrev = get_task_list_detail[0].id_user
        user.roleNamePrev = get_task_list_detail[0].role_name
        user.roleName = get_task_list_detail[0].role_name_prev
    }
    else if(get_task_list_detail[0].status_dokumen == 6 && user.statusDokumen == 2)
    {
        user.idUser = get_task_list_detail[0].id_user_prev
        user.idUserPrev = get_task_list_detail[0].id_user
        user.roleNamePrev = get_task_list_detail[0].role_name
        user.roleName = get_task_list_detail[0].role_name_prev
    }
    update_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.t_task_list_detail SET end_task=:end_task, millisecond_diff=:millisecond_diff, version=:version, modified_by=:modified_by, modified_date=now() WHERE task_detail_id=:task_detail_id;", {
        replacements: {task_detail_id: get_task_list_detail[0].task_detail_id, end_task: new Date(), millisecond_diff: new Date() - new Date(get_task_list_detail[0].start_task), version: +get_task_list_detail[0].version+1, modified_by: created_by},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})
    if(user.isTaskListDone == false)
    {
        insert_tasklist = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.t_task_list_detail(task_detail_id, task_id, id_user_prev, role_name_prev, id_user, role_name, transition_id, status_dokumen, start_task, end_task, millisecond_diff, is_active, version, created_by, created_date) VALUES(generate_uuid_v4(), :task_id, :id_user_prev, :role_name_prev, :id_user, :role_name, :transition_id, :status_dokumen, :start_task, null, null, true, 0, :created_by, now()) returning *;", {
            replacements: {task_id: task_id, id_user_prev: user.idUserPrev, role_name_prev: user.roleNamePrev, id_user: user.idUser, role_name: user.roleName, transition_id: user.transitionId, status_dokumen: user.statusDokumen, start_task: new Date(), created_by: created_by},
            type: model.sequelize1.QueryTypes.INSERT,
            quoteIdentifiers: true})
    }
    
    if(insert_tasklist.length)
    {
        return insert_tasklist
    }
    else
    {
        return update_tasklist
    }    
} 

exports.updateNoVa = async function (policy_id, va_number, va_expired_date) {
    update_no_va = await model.sequelize1.query("update t_policy set va_number = :va_number, va_expired_date = :va_expired_date where policy_id = :policy_id", {
        replacements: {policy_id: policy_id, va_number: va_number, va_expired_date: va_expired_date},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    return update_no_va
}

exports.getNoPolis = async function (product_id, id_cabang) {
    let no_polis
    let counter = await model.sequelize2.query("SELECT ID, LAST_GENERATED_NUMBER, PROCESS_CODE, COB_CODE, YEAR_ISSUED, BRANCH_CODE, BUSINESS_SOURCE, DIGIT_CHECK, ISSUED_NUMBER_1, ISSUED_NUMBER_2 FROM MASTER.M_GEN_NUMBER WHERE PROCESS_CODE = 'POLIS' AND BUSINESS_SOURCE = 6 AND COB_CODE = :product_id AND YEAR_ISSUED = :tahun AND BRANCH_CODE = :id_cabang", {
        replacements: {product_id: product_id, tahun: dateFormat(new Date(), 'yyyy'), id_cabang: '0'+id_cabang},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    if(counter.length)
    {
        let current_counter = +counter[0].ISSUED_NUMBER_1+1
        let counter_padded = padWithZeroes(current_counter,5)
        let tahun = dateFormat(new Date(), 'yy')
        let cek_digit = ((+product_id * 9) + (+id_cabang * 4) + (+tahun * 2) + (+current_counter * 3)) % 9
        no_polis = product_id+'.'+tahun+'.0'+id_cabang+'.6.'+counter_padded+'-'+cek_digit+'/00'

        await model.sequelize2.query("UPDATE ACS_DB_UAT_ALLSTREAM.MASTER.M_GEN_NUMBER SET LAST_GENERATED_NUMBER= :last_generated_number, DIGIT_CHECK= :digit_check, ISSUED_NUMBER_1= :issued_number_1 WHERE ID= :id;", {
            replacements: {last_generated_number: no_polis, digit_check: cek_digit, issued_number_1: counter_padded, id: counter[0].ID},
            type: model.sequelize1.QueryTypes.UPDATE,
            quoteIdentifiers: true})
    }
    else
    {
        let current_counter = 1
        let counter_padded = padWithZeroes(current_counter,5)
        let tahun = dateFormat(new Date(), 'yy')
        let cek_digit = ((+product_id * 9) + (+id_cabang * 4) + (+tahun * 2) + (+current_counter * 3)) % 9
        no_polis = product_id+'.'+tahun+'.0'+id_cabang+'.6.'+counter_padded+'-'+cek_digit+'/00'
        await model.sequelize2.query("INSERT INTO ACS_DB_UAT_ALLSTREAM.MASTER.M_GEN_NUMBER(LAST_GENERATED_NUMBER, PROCESS_CODE, COB_CODE, YEAR_ISSUED, BRANCH_CODE, BUSINESS_SOURCE, DIGIT_CHECK, ISSUED_NUMBER_1, ISSUED_NUMBER_2, CREATED_BY, CREATED_DATE)VALUES(:last_generated_number, :process_code, :cob_code, :year_issued, :branch_code, :business_source, :digit_check, :issued_number_1, :issued_number_2, 'h2h.system', GETDATE());", {
            replacements: {last_generated_number: no_polis, process_code: 'POLIS', cob_code: product_id, year_issued: dateFormat(new Date(), 'yyyy'), branch_code: '0'+id_cabang, business_source: '6', digit_check: cek_digit, issued_number_1: counter_padded, issued_number_2: '00'},
            type: model.sequelize1.QueryTypes.INSERT,
            quoteIdentifiers: true})
        
    }

    return no_polis
}