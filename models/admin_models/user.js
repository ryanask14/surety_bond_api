var model = require('../index');
var approval_model = require('../approval_models/approval.js');
const { query } = require('express');

//------User Management
exports.getTaskList = async function (id_user) {

    get_username = await model.sequelize1.query("SELECT c.nama AS jenis_dokumen, a.dokument_id, a.description, d.nama AS status_dokumen, e.role_name FROM t_task_list a INNER JOIN m_user b ON a.id_user = b.id_user INNER JOIN m_tipe_dokumen c ON a.id_tipe_dokumen = c.id_tipe_dokumen INNER JOIN m_status_dokumen d ON a.status_dokumen = d.id_status INNER JOIN m_role e ON a.role_name = e.role_name WHERE a.id_user = :id_user AND is_task_list_done = FALSE", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_username
}

exports.getJumlahTaskList = async function (id_user) {

    get_username = await model.sequelize1.query("SELECT COUNT(task_id) AS jml_task_list FROM t_task_list WHERE id_user = :id_user AND is_task_list_done = FALSE", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_username
}
exports.getUserByUsername = async function (username) {

    let get_username = await model.sequelize1.query("select * from m_user a, r_user_roles b where a.id_user = b.id_user and a.username = :username", {
        replacements: {username: username},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_username[0]
}

exports.getUserByEmail = async function (email) {

    let get_username = await model.sequelize1.query("select * from m_user a, r_user_roles b where a.id_user = b.id_user and a.email = :email", {
        replacements: {email: email},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return get_username[0]
}

exports.getAllUser = async function (id_cabang) {

    let query_string

    if(id_cabang == 'KP')
    {
        query_string = 'select a.id_user, a.id_group, a.id_cabang, b.nama_cabang, a.id_bp, a.id_tipe_dokumen, a.id_status, a.account_expired, a.account_locked, a.credential_is_expired, a.confirmation_token, a.username, a.fullname, a.email, a.is_need_approval, a.login_attempt, a.description, a.is_active, c.group_name from m_user a, m_group c, m_cabang b where a.id_cabang = b.id_cabang and a.id_group = c.id_group;'
    }
    else
    {
        query_string = 'select a.id_user, a.id_group, a.id_cabang, b.nama_cabang, a.id_bp, a.id_tipe_dokumen, a.id_status, a.account_expired, a.account_locked, a.credential_is_expired, a.confirmation_token, a.username, a.fullname, a.email, a.is_need_approval, a.login_attempt, a.description, a.is_active, c.group_name from m_user a, m_group c, m_cabang b where a.id_cabang = b.id_cabang and a.id_group = c.id_group and a.id_cabang = :id_cabang;'
    }

    user_login = await model.sequelize1.query(query_string, {
        replacements:{id_cabang: id_cabang},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    count_data = await model.sequelize1.query("select count(a.id_user) as data_count from m_user a where a.id_cabang = :id_cabang;", {
        replacements:{id_cabang: id_cabang},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {user_data:user_login, count_data: count_data[0]}
}

exports.postSearchUser = async function (limit, offset, username, fullname, email, id_cabang, group_user) {

    let query_string

    if(id_cabang == 'KP')
    {
        if(group_user != '' || group_user)
        {
            query_string = 'select a.id_user as id_user, a.id_cabang, b.nama_cabang, a.username as username, a.fullname as fullname, a.id_group as id_group, c.group_name as group_name, a.email as email, a.is_active as is_active from m_user a, m_group c, m_cabang b where a.id_cabang = b.id_cabang and a.id_group = c.id_group and ((a.username = :username or a.username like :username1 or a.username like :username2 or a.username like :username3) and (UPPER(a.fullname) = :fullname or UPPER(a.fullname) like :fullname1 or UPPER(a.fullname) like :fullname2 or UPPER(a.fullname) like :fullname3) and (a.email = :email or a.email like :email1 or a.email like :email2 or a.email like :email3)) and a.id_group = :id_group limit :limit offset :offset;'   
        }
        else
        {
            query_string = 'select a.id_user as id_user, a.id_cabang, b.nama_cabang, a.username as username, a.fullname as fullname, a.id_group as id_group, c.group_name as group_name, a.email as email, a.is_active as is_active from m_user a, m_group c, m_cabang b where a.id_cabang = b.id_cabang and a.id_group = c.id_group and ((a.username = :username or a.username like :username1 or a.username like :username2 or a.username like :username3) and (UPPER(a.fullname) = :fullname or UPPER(a.fullname) like :fullname1 or UPPER(a.fullname) like :fullname2 or UPPER(a.fullname) like :fullname3) and (a.email = :email or a.email like :email1 or a.email like :email2 or a.email like :email3)) limit :limit offset :offset;'
        }   
    }
    else
    {
        if(group_user != '' || group_user)
        {
            query_string = 'select a.id_user as id_user, a.id_cabang, b.nama_cabang, a.username as username, a.fullname as fullname, a.id_group as id_group, c.group_name as group_name, a.email as email, a.is_active as is_active from m_user a, m_group c, m_cabang b where a.id_cabang = b.id_cabang and a.id_group = c.id_group and ((a.username = :username or a.username like :username1 or a.username like :username2 or a.username like :username3) and (UPPER(a.fullname) = :fullname or UPPER(a.fullname) like :fullname1 or UPPER(a.fullname) like :fullname2 or UPPER(a.fullname) like :fullname3) and (a.email = :email or a.email like :email1 or a.email like :email2 or a.email like :email3)) and a.id_cabang = :id_cabang and a.id_group = :id_group limit :limit offset :offset;'
        }
        else
        {
            query_string = 'select a.id_user as id_user, a.id_cabang, b.nama_cabang, a.username as username, a.fullname as fullname, a.id_group as id_group, c.group_name as group_name, a.email as email, a.is_active as is_active from m_user a, m_group c, m_cabang b where a.id_cabang = b.id_cabang and a.id_group = c.id_group and ((a.username = :username or a.username like :username1 or a.username like :username2 or a.username like :username3) and (UPPER(a.fullname) = :fullname or UPPER(a.fullname) like :fullname1 or UPPER(a.fullname) like :fullname2 or UPPER(a.fullname) like :fullname3) and (a.email = :email or a.email like :email1 or a.email like :email2 or a.email like :email3)) and a.id_cabang = :id_cabang limit :limit offset :offset;'
        }
    }

    user_login = await model.sequelize1.query(query_string, {
        replacements: {limit: limit, offset: (limit*(offset-1)), username: username, username1: '%'+username, username2: '%'+username+'%', username3: username+'%', fullname: fullname.toUpperCase(), fullname1: '%'+fullname.toUpperCase(), fullname2: '%'+fullname.toUpperCase()+'%', fullname3: fullname.toUpperCase()+'%', email: email, email1: '%'+email, email2: '%'+email+'%', email3: email+'%', id_cabang  :id_cabang, id_group: group_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    count_data = await model.sequelize1.query("select count(a.id_user) as data_count from m_user a where ((a.username = :username or a.username like :username1 or a.username like :username2 or a.username like :username3) and (a.fullname = :fullname or a.fullname like :fullname1 or a.fullname like :fullname2 or a.fullname like :fullname3) and (a.email = :email or a.email like :email1 or a.email like :email2 or a.email like :email3)) and a.id_cabang = :id_cabang;", {
        replacements: {username: username, username1: '%'+username, username2: '%'+username+'%', username3: username+'%', fullname: fullname, fullname1: '%'+fullname, fullname2: '%'+fullname+'%', fullname3: fullname+'%', email: email, email1: '%'+email, email2: '%'+email+'%', email3: email+'%', id_cabang :id_cabang, id_group: group_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_data:user_login, count_data: count_data[0]}
}

exports.getUserById = async function (id_user) {

    get_user_by_id = await model.sequelize1.query("select a.id_user, a.id_group, a.id_cabang, a.id_bp, a.id_tipe_dokumen, a.id_status, a.account_expired, a.account_locked, a.credential_is_expired, a.confirmation_token, a.username, a.fullname, a.email, a.is_need_approval, a.login_attempt, a.description, a.is_active from m_user a where id_user = :id_user;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 
    
    get_user_role = await model.sequelize1.query("select a.role_name from r_user_roles a inner join m_role b on a.role_name = b.role_name where id_user = :id_user and b.is_active = true;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 
    
    get_user_group_menu = await model.sequelize1.query("select a.id_group_menu from r_user_group_menu a, m_group_menu b where a.id_group_menu = b.id_group_menu and b.is_active = true and id_user = :id_user;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 

    get_user_product_auth = await model.sequelize1.query("select a.id_product_auth from r_user_product_auth a, m_product_auth b where a.id_product_auth = b.id_product_auth and b.is_active = true and id_user = :id_user;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 

    get_user_menu = await model.sequelize1.query("select d.* from r_user_group_menu a inner join m_group_menu b on a.id_group_menu = b.id_group_menu inner join r_menu_group_menu c on b.id_group_menu = c.id_group_menu inner join m_menu d on c.id_menu = d.id_menu where a.id_user = :id_user and d.is_active = true and b.is_active = true;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 
    
    get_user_group_product = await model.sequelize1.query("select * from m_product_group where is_active = true;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_user_product = await model.sequelize1.query("select c.* from r_user_product_auth a inner join r_product_auth_product b on a.id_product_auth = b.id_product_auth inner join m_product c on b.product_id = c.product_id inner join m_product_group d on c.product_group_id = d.product_group_id where a.id_user = '217145e9-8e52-48ff-94bc-ccb918584eed' and c.is_active = true and d.is_active = true;", {
        replacements: {id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 
    
    for(let i=0 ; i<get_user_group_product.length; i++)
    {
        let check = get_user_product.filter(attrib => attrib.product_group_id == get_user_group_product[i].product_group_id)
        if(check.length)
        {
            get_user_group_product[i].child = check
        }
    }

    return {user: get_user_by_id, role: get_user_role, group_menu: get_user_group_menu, product_auth: get_user_product_auth, menu: get_user_menu, product: get_user_group_product}
}

exports.getAllMaster = async function () {

    get_cabang = await model.sequelize1.query("select * from m_cabang where is_active = true;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_user_group = await model.sequelize1.query("select * from m_group where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_menu = await model.sequelize1.query("select b.id_group_menu, a.id_menu, a.parent_id , b.group_name, a.module_name, a.title, a.icon, a.level, a.ordering, a.page_url, a.is_active, a.is_leaf from m_menu a, m_group_menu b, r_menu_group_menu c where a.id_menu = c.id_menu and b.id_group_menu = c.id_group_menu and a.is_active = true and b. is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    get_role_user = await model.sequelize1.query("select * from m_role where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
    get_group_product = await model.sequelize1.query("select * from m_product_group where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_product_auth_by_id = await model.sequelize1.query("select a.id_product_auth, c.product_id, c.product_group_id , a.name as product_auth_name, a.is_active, c.name as product_name from m_product_auth a inner join r_product_auth_product b on a.id_product_auth = b.id_product_auth inner join m_product c on b.product_id = c.product_id where c.is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    for(let i=0 ; i<get_group_product.length; i++)
    {
        let check = get_product_auth_by_id.filter(attrib => attrib.product_group_id == get_group_product[i].product_group_id)
        if(check.length)
        {
            get_group_product[i].child = check
        }
    }

    return {get_cabang:get_cabang, get_user_group: get_user_group, get_menu: get_menu, get_role_user: get_role_user, get_product_auth: get_group_product}
}

exports.getAllAgen = async function () {

    user_agen = await model.sequelize1.query("select a.id_bp, a.id_no, a.name, a.npwp, a.cif_no from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN') and a.is_active = true;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    count_data = await model.sequelize1.query("select count(a.id_no) as data_count from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN') and a.is_active = true;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {agen_data:user_agen, count_data: count_data[0]}
}

exports.getTasklistNotifications = async function (id_user) {

    completed = await model.sequelize1.query("select a.*, b.nama as jenis_dokumen, c.nama as status_dokumen from t_task_list a, m_tipe_dokumen b, m_status_dokumen c where a.id_tipe_dokumen = b.id_tipe_dokumen and a.status_dokumen = c.id_status and id_user_prev = :id_user and is_task_list_done = true order by end_task desc limit 10;", {
        replacements:{id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    ongoing = await model.sequelize1.query("select a.*, b.nama as jenis_dokumen, c.nama as status_dokumen from t_task_list a, m_tipe_dokumen b, m_status_dokumen c where a.id_tipe_dokumen = b.id_tipe_dokumen and a.status_dokumen = c.id_status and id_user = :id_user and is_task_list_done = false order by created_by desc;", {
        replacements:{id_user: id_user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {completed_task: completed, ongoing_task: ongoing}
}

exports.postSearchAgen = async function (limit, offset, name, npwp, id_no, cif_no) {

    user_agen = await model.sequelize1.query("select a.id_no, a.name, a.npwp, a.cif_no from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN') and ((UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3)) and a.is_active = true limit :limit offset :offset;", {
        replacements: {limit: limit, offset: (limit*(offset-1)), name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp, npwp1: '%'+npwp, npwp2: '%'+npwp+'%', npwp3: npwp+'%', id_no: id_no, id_no1: '%'+id_no, id_no2: '%'+id_no+'%', id_no3: id_no+'%', cif_no: cif_no, cif_no1: '%'+cif_no, cif_no2: '%'+cif_no+'%', cif_no3: cif_no+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    data_count = await model.sequelize1.query("select count(a.id_bp) as data_count from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN') and ((UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3)) and a.is_active = true;", {
        replacements: {name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp, npwp1: '%'+npwp, npwp2: '%'+npwp+'%', npwp3: npwp+'%', id_no: id_no, id_no1: '%'+id_no, id_no2: '%'+id_no+'%', id_no3: id_no+'%', cif_no: cif_no, cif_no1: '%'+cif_no, cif_no2: '%'+cif_no+'%', cif_no3: cif_no+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_agen:user_agen, count_data: data_count[0]}
}

exports.insertUser = async function (user, created_by, cabang, login_fullname) {
    let is_need_approval = true
    if(cabang == 'KP')
    {
        is_need_approval = false
        user.idStatus = 3
    }

    try
    {
        return await model.sequelize1.transaction(async (t) => {

            insert_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO m_user (id_user, id_group, id_cabang, id_bp, id_tipe_dokumen, id_status, account_expired, account_locked, credential_is_expired, confirmation_token, username, password, fullname, email, is_need_approval, login_attempt, description, is_active, version, created_by, created_date, modified_by, modified_date) VALUES(uuid_generate_v4(), :id_group, :id_cabang, :id_no, :id_tipe_dokumen, :id_status, false, :account_locked, false, null, :username, :password, :fullname, :email, :is_need_approval, :login_attempt, :description, true, 0, :created_by, now(), :modified_by, :modified_date) returning id_user, fullname;", {
                replacements: {id_group: user.idGroup, id_cabang: user.idCabang, id_no: user.idBp, id_tipe_dokumen: user.idTipeDokumen, id_status: user.idStatus, account_locked: user.accountLocked, is_need_approval: is_need_approval, username: user.username, password: user.password, fullname: user.fullname, email: user.email, login_attempt: 0, description: null, created_by: created_by, modified_by: null, modified_date: null},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            if(cabang != 'KP')
            {
                if(user.disposisi)
                {
                    console.log(user)
                    user.disposisi.dokumentId = insert_user[0][0].id_user
                    user.disposisi.dokumentNo = insert_user[0][0].fullname
                    insert_disposisi = await approval_model.insertDisposisi(user.idTipeDokumen, insert_user[0][0].id_user, user.idStatus, user.disposisi.disposisi, login_fullname);
                    insert_tasklist = await approval_model.insertTaskList(user, created_by);
                }
            }

            for(let i = 0; i<user.roleName.length; i++)
            {
                insert_role_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_user_roles(role_name, id_user)VALUES(:role_name, :id_user);", {
                    replacements: {role_name: user.roleName[i], id_user: insert_user[0][0].id_user},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t})       
            }

            for(let i = 0; i<user.idGroupMenu.length; i++)
            {
                insert_group_menu_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_user_group_menu(id_user, id_group_menu)VALUES(:id_user, :id_group_menu);", {
                    replacements: {id_group_menu: user.idGroupMenu[i], id_user: insert_user[0][0].id_user},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t}) 
            }

            for(let i = 0; i<user.idProductAuth.length; i++)
            {
                insert_product_auth_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_user_product_auth(id_user, id_product_auth)VALUES(:id_user, :id_product_auth);", {
                    replacements: {id_product_auth: user.idProductAuth[i], id_user: insert_user[0][0].id_user},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t}) 
            }

            return insert_user
        });
    }
    catch(e)
    {
        throw new Error(e)
    }
}

exports.updateUser = async function (user, created_by) {
    try{
        return await model.sequelize1.transaction(async (t) => {

            get_user = await model.sequelize1.query("select * from m_user where id_user = :id_user", {
                replacements:{id_user: user.idUser},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t}) 
            
            if((get_user[0].id_status == 1 && user.idStatus != 1) || (get_user[0].id_status == 3 && user.idStatus != 3) || (get_user[0].id_status == 6 && user.idStatus != 6))
            {
                if(user.idCabang != 'KP')
                {
                    if(user.disposisi)
                    {
                        user.disposisi.dokumentId = get_user[0].id_user
                        user.disposisi.dokumentNo = get_user[0].fullname
                        insert_disposisi = await approval_model.insertDisposisi(user.idTipeDokumen, get_user[0].id_user, user.idStatus, user.disposisi.disposisi, get_user[0].fullname);
                        insert_tasklist = await approval_model.insertTaskList(user, created_by);
                    }
                }
            }

            update_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.m_user SET id_group=:id_group, id_cabang=:id_cabang, id_bp=:id_no, id_tipe_dokumen=:id_tipe_dokumen, id_status=:id_status, username=:username, fullname=:fullname, email=:email, account_locked = :account_locked, is_active= :is_active, description=null, version=:version, modified_by=:modified_by, modified_date=now() WHERE id_user=:id_user returning id_user;", {
                replacements: {id_user: user.idUser, id_group: user.idGroup, id_cabang: user.idCabang, id_no: user.idBp, id_tipe_dokumen: user.idTipeDokumen, id_status: user.idStatus, username: user.username, fullname: user.fullname, email: user.email, account_locked: user.accountLocked, is_active: user.isActive, description: null, version: +get_user[0].version+1, modified_by: created_by},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})

            get_user_role_not_include = await model.sequelize1.query("select * from r_user_roles where role_name not in(:role_name) and id_user = :id_user", {
                replacements:{role_name: user.roleName, id_user: user.idUser},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(get_user_role_not_include[0])
            {
                delete_user_role_not_include = await model.sequelize1.query("delete from r_user_roles where role_name not in(:role_name) and id_user = :id_user", {
                    replacements:{role_name: user.roleName, id_user: user.idUser},
                    type: model.sequelize1.QueryTypes.DELETE,
                    quoteIdentifiers: true, transaction: t})
            }

            for(let i = 0; i<user.roleName.length; i++)
            {
                get_user_role = await model.sequelize1.query("select * from r_user_roles where role_name = :role_name and id_user = :id_user", {
                    replacements:{role_name: user.roleName[i], id_user: user.idUser},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(!get_user_role[0])
                {
                    insert_role_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_user_roles(role_name, id_user)VALUES(:role_name, :id_user);", {
                        replacements: {role_name: user.roleName[i], id_user: user.idUser},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t})     
                }  
            }

            get_group_menu_not_include = await model.sequelize1.query("select * from r_user_group_menu where id_group_menu not in(:id_group_menu) and id_user = :id_user", {
                replacements:{id_group_menu: user.idGroupMenu, id_user: user.idUser},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(get_group_menu_not_include[0])
            {
                delete_group_menu_not_include = await model.sequelize1.query("delete from r_user_group_menu where id_group_menu not in(:id_group_menu) and id_user = :id_user", {
                    replacements:{id_group_menu: user.idGroupMenu, id_user: user.idUser},
                    type: model.sequelize1.QueryTypes.DELETE,
                    quoteIdentifiers: true, transaction: t})
            }

            for(let i = 0; i<user.idGroupMenu.length; i++)
            {
                get_group_user = await model.sequelize1.query("select * from r_user_group_menu where id_group_menu = :id_group_menu and id_user = :id_user", {
                    replacements:{id_group_menu: user.idGroupMenu[i], id_user: user.idUser},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(!get_group_user[0])
                {
                    insert_group_menu_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_user_group_menu(id_user, id_group_menu)VALUES(:id_user, :id_group_menu);", {
                        replacements: {id_group_menu: user.idGroupMenu[i], id_user: user.idUser},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t}) 
                }
            }

            get_user_product_auth_not_include = await model.sequelize1.query("select * from r_user_product_auth where id_product_auth not in(:id_product_auth) and id_user = :id_user", {
                replacements:{id_product_auth: user.idProductAuth, id_user: user.idUser},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(get_user_product_auth_not_include[0])
            {
                delete_group_menu_not_include = await model.sequelize1.query("delete from r_user_product_auth where id_product_auth not in(:id_product_auth) and id_user = :id_user", {
                    replacements:{id_product_auth: user.idProductAuth, id_user: user.idUser},
                    type: model.sequelize1.QueryTypes.DELETE,
                    quoteIdentifiers: true, transaction: t})
            }

            for(let i = 0; i<user.idProductAuth.length; i++)
            {
                get_product_auth = await model.sequelize1.query("select * from r_user_product_auth where id_product_auth = :id_product_auth and id_user = :id_user", {
                    replacements:{id_product_auth: user.idProductAuth[i], id_user: user.idUser},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(!get_product_auth[0])
                {
                    insert_product_auth_user = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_user_product_auth(id_user, id_product_auth)VALUES(:id_user, :id_product_auth);", {
                        replacements: {id_product_auth: user.idProductAuth[i], id_user: user.idUser},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t}) 
                }
            }

            return update_user
        })
    }
    catch(e){
        console.log(e)
        throw new Error(e)
    }
}

//-----LOGIN

exports.getUserMenu = async function (username) {
    user_menu = await model.sequelize1.query("SELECT users.id_user, menu.id_menu, menu.parent_id, menu.level, menu.ordering, menu.id_menu, menu.module_name, menu.title, menu.icon, menu.is_leaf, menu.page_url FROM m_user users INNER JOIN r_user_group_menu user_menu ON users.id_user = user_menu.id_user INNER JOIN r_menu_group_menu menu_group_menu ON user_menu.id_group_menu = menu_group_menu.id_group_menu INNER JOIN m_menu menu ON menu_group_menu.id_menu = menu.id_menu WHERE users.username = :username and menu.is_active = true ORDER BY menu.module_name, menu.level, menu.ordering", {
        replacements: {username: username},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return user_menu
}

exports.getUserProduct = async function (username) {
    user_product = await model.sequelize1.query("SELECT users.id_user, product.product_id, product.name FROM m_user users INNER JOIN r_user_product_auth user_produk ON users.id_user = user_produk.id_user INNER JOIN r_product_auth_product product_auth_product ON user_produk.id_product_auth = product_auth_product.id_product_auth INNER JOIN m_product product ON product_auth_product.product_id = product.product_id WHERE users.username = :username and product.is_active = true", {
        replacements: {username: username},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return user_product
}

exports.getUserLogin = async function (username, password) {

    user_login = await model.sequelize1.query("select a.id_user, a.id_group, a.id_cabang, a.id_bp, a.id_tipe_dokumen, a.is_top_enable, a.id_status, a.account_expired, a.account_locked, a.credential_is_expired, a.confirmation_token, a.username, a.password, a.fullname, a.email, a.is_need_approval, a.login_attempt, a.description, a.is_active, b.role_name from m_user a, r_user_roles b where a.id_user = b.id_user and a.username = :username and a.password = :password and a.is_active = true", {
        replacements: {username: username, password: password},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    // if(user_login)
    // {
    //     user_login = await model.sequelize1.query("select a.username, a.login_token, a.account_locked, b.role_name from m_user a, r_user_roles b where a.id_user = b.id_user and a.username = :username and a.password = :password", {
    //         replacements: {username: username, password: password},
    //         type: model.sequelize1.QueryTypes.SELECT,
    //         quoteIdentifiers: true})

    //     menu_user = await model.sequelize1.query("select a.username, a.login_token, a.account_locked, b.role_name from m_user a, r_user_roles b where a.id_user = b.id_user and a.username = :username and a.password = :password", {
    //         replacements: {username: username, password: password},
    //         type: model.sequelize1.QueryTypes.SELECT,
    //         quoteIdentifiers: true})
        
    //     user_login = await model.sequelize1.query("select a.username, a.login_token, a.account_locked, b.role_name from m_user a, r_user_roles b where a.id_user = b.id_user and a.username = :username and a.password = :password", {
    //         replacements: {username: username, password: password},
    //         type: model.sequelize1.QueryTypes.SELECT,
    //         quoteIdentifiers: true})
    // }
    // else
    // {
        return user_login
    // }
    
}

exports.updateTokenLogin = async function (user) {

    update_token = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update m_user set login_token = :login_token where username = :username;", {
        replacements: {login_token: user.login_token, username: user.username},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    return update_token
}

exports.updatePassword = async function (password, id_user, username) {

    update_password = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update m_user set password = :password, confirmation_token = uuid_generate_v4(), modified_by = :modified_by, modified_date = now() where id_user = :id_user returning *;", {
        replacements: {password: password, id_user: id_user, modified_by: username},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    return update_password
}

exports.updateLoginAttempt = async function (username) {

    user_login = await this.getUserByUsername(username)
    if(user_login)
    {
        if(user_login.login_attempt < 3 && user_login.account_locked == false)
        {
            login_attempt = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update m_user set login_attempt = :login_attempt where username = :username;", {
                replacements: {username: username, login_attempt: +user_login.login_attempt + 1},
                type: model.sequelize1.QueryTypes.UPDATE,
                quoteIdentifiers: true})

            user_login = await this.getUserByUsername(username)
            if(user_login.login_attempt == 3)
            {
                lock_account = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update m_user set account_locked = true where username = :username;", {
                    replacements: {username: username},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true})
            }
        }
        else
        {
            return false
        }
    }
}

exports.resetLoginAttempt = async function (username) {

    reset_attempt = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update m_user set login_attempt = :login_attempt where username = :username;", {
        replacements: {username: username, login_attempt: 0},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})
}

exports.removeTokenLogin = async function (login_token) {

    remove_login = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; update m_user set login_token = null where login_token = :login_token;", {
        replacements: {login_token: login_token},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})
}