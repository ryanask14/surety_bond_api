var model = require('../index');

exports.getAllGroupMenu = async function () {

    get_all_group_menu = await model.sequelize1.query("select id_group_menu, group_name, is_active, version from m_group_menu;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {group_menu_data: get_all_group_menu}
}

exports.getGroupMenuById = async function (id) {

    get_group_menu_by_id = await model.sequelize1.query("select id_group_menu, group_name, is_active, version from m_group_menu where id_group_menu = :id_group_menu;", {
        replacements: {id_group_menu: id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    get_menu = await model.sequelize1.query("select a.id_menu, a.parent_id, a.module_name, a.is_leaf, a.level, a.ordering, a.icon, a.title, a.page_url from m_menu a inner join r_menu_group_menu b on a.id_menu = b.id_menu where b.id_group_menu = :id_group_menu and a.is_active = true;", {
        replacements: {id_group_menu: id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {group_menu_data: get_group_menu_by_id, menu_data: get_menu}
}

exports.getSearchGroupMenu = async function (body) {

    let search_group_menu = await model.sequelize1.query("select id_group_menu, group_name, is_active, version from m_group_menu where (UPPER(group_name) = :group_name or UPPER(group_name) like :group_name1 or UPPER(group_name) like :group_name2 or UPPER(group_name) like :group_name3);", {
        replacements:{group_name: body.groupName.toUpperCase(), group_name1: '%'+body.groupName.toUpperCase(), group_name2: '%'+body.groupName.toUpperCase()+'%', group_name3: body.groupName.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let count_data = await model.sequelize1.query("select count(id_group_menu) as data_count from m_group_menu where (UPPER(group_name) = :group_name or UPPER(group_name) like :group_name1 or UPPER(group_name) like :group_name2 or UPPER(group_name) like :group_name3);", {
        replacements:{group_name: body.groupName.toUpperCase(), group_name1: '%'+body.groupName.toUpperCase(), group_name2: '%'+body.groupName.toUpperCase()+'%', group_name3: body.groupName.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {group_menu_data: search_group_menu, data_count: count_data}
}

exports.postGroupMenu = async function (body, created_by) {

    insert_group_menu = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.m_group_menu(id_group_menu, group_name, is_active, version, created_by, created_date, modified_by, modified_date)VALUES(uuid_generate_v4(), :group_name, :is_active, 0, :created_by, now(), null, null) RETURNING id_group_menu, group_name, is_active;", {
        replacements:{group_name: body.groupName, is_active: body.isActive, created_by: created_by},
        type: model.sequelize1.QueryTypes.INSERT,
        quoteIdentifiers: true})

    for(let i = 0; i < body.idMenu.length; i++)
    {
        insert_r_menu_group_menu = await model.sequelize1.query("INSERT INTO public.r_menu_group_menu(id_group_menu, id_menu)VALUES(:id_group_menu, :id_menu);", {
            replacements:{id_group_menu: insert_group_menu[0][0].id_group_menu, id_menu: body.idMenu[i]},
            type: model.sequelize1.QueryTypes.INSERT,
            quoteIdentifiers: true})
    }

    return {group_menu_data: insert_group_menu}
}

exports.putGroupMenu = async function (body, created_by) {

    get_group_menu_by_id = await model.sequelize1.query("select id_group_menu, group_name, is_active, version from m_group_menu where id_group_menu = :id_group_menu;", {
        replacements:{id_group_menu: body.idGroupMenu},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    update_group_menu = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.m_group_menu SET group_name = :group_name, is_active = :is_active, version = :version, modified_by = :created_by, modified_date = now() WHERE id_group_menu = :id_group_menu RETURNING id_group_menu, group_name, is_active;", {
        replacements:{id_group_menu: body.idGroupMenu, group_name: body.groupName, is_active: body.isActive, version: +get_group_menu_by_id[0].version+1, created_by: created_by},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    get_menu_group_menu_not_include = await model.sequelize1.query("select * from r_menu_group_menu where id_menu not in(:id_menu) and id_group_menu = :id_group_menu", {
        replacements:{id_menu: body.idMenu, id_group_menu: body.idGroupMenu},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    if(get_menu_group_menu_not_include[0])
    {
        delete_user_role_not_include = await model.sequelize1.query("delete from r_menu_group_menu where id_menu not in(:id_menu) and id_group_menu = :id_group_menu", {
            replacements:{id_menu: body.idMenu, id_group_menu: body.idGroupMenu},
            type: model.sequelize1.QueryTypes.DELETE,
            quoteIdentifiers: true})
    }

    for(let i = 0; i<body.idMenu.length; i++)
    {
        get_menu_group_menu = await model.sequelize1.query("select * from r_menu_group_menu where id_menu = :id_menu and id_group_menu = :id_group_menu", {
            replacements:{id_menu: body.idMenu[i], id_group_menu: body.idGroupMenu},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
        if(!get_menu_group_menu[0])
        {
            insert_menu_group_menu = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.r_menu_group_menu(id_group_menu, id_menu)VALUES(:id_group_menu, :id_menu);", {
                replacements: {id_menu: body.idMenu[i], id_group_menu: body.idGroupMenu},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true})     
        }  
    }

        return {group_menu_data: update_group_menu}
}