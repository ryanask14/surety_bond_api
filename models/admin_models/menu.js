var model = require('../index');

exports.getModuleName = async function () {

    get_lookup = await model.sequelize1.query("select lookup_key, lookup_group, key_only, is_active from m_lookup where lookup_group = 'MODULE_MENU';", {
        
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {menu_data:get_lookup}
}

exports.getParentName = async function () {

    get_parent = await model.sequelize1.query("select id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active from m_menu where is_leaf = false;", {
        
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {menu_data:get_parent}
}

exports.getAllMenu = async function () {

    get_all_menu = await model.sequelize1.query("select id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active from m_menu;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    count_data = await model.sequelize1.query("select count(id_menu) as data_count from m_menu;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {menu_data:get_all_menu, count_data: count_data[0].data_count}
}

exports.getMenuById = async function (id) {

    get_menu_by_id = await model.sequelize1.query("select id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active from m_menu where id_menu = :id_menu;", {
        replacements: {id_menu: id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    count_data = await model.sequelize1.query("select count(id_menu) as data_count from m_menu where id_menu = :id_menu;", {
        replacements: {id_menu: id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {menu_data:get_menu_by_id, count_data: count_data[0].data_count}
}

exports.getMenuSearch = async function (body) {

    var sql_string
    var replacements

    if(body.title != '' || !body.title)
    {
        sql_string = 'select id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active from m_menu where module_name = :module_name and (UPPER(title) = :title or UPPER(title) like :title1 or UPPER(title) like :title2 or UPPER(title) like :title3)'
        replacements = {module_name: body.moduleName, title: body.title.toUpperCase(), title1: '%'+body.title.toUpperCase(), title2: '%'+body.title.toUpperCase()+'%', title3: body.title.toUpperCase()+'%'}
    }
    else
    {
        sql_string = 'select id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active from m_menu where module_name = :module_name'
        replacements = {module_name: body.moduleName}
    }

    get_menu_search = await model.sequelize1.query(sql_string, {
        replacements: replacements,
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {menu_data:get_menu_search}
}

exports.putMenu = async function (body, username) {

    get_menu = await model.sequelize1.query("select id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active, version from m_menu where id_menu = :id_menu", {
        replacements:{id_menu: body.idMenu},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    update_menu = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE public.m_menu SET parent_id = :parent_id, module_name = :module_name, is_leaf = :is_leaf, level = :level, ordering = :ordering, icon = :icon, title = :title, page_url = :page_url, is_active = :is_active, version = :version, modified_by = :created_by, modified_date = now() WHERE id_menu = :id_menu RETURNING id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active;", {
        replacements:{id_menu: body.idMenu, parent_id: body.parentId, module_name: body.moduleName, is_leaf: body.isLeaf, level: body.level, ordering: body.ordering, icon: body.icon, title: body.title, page_url: body.pageUrl, is_active: body.isActive, version: +get_menu[0].version+1, created_by: username},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

        return {menu_data:update_menu}
}

exports.postMenu = async function (body, username) {

    insert_menu = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO public.m_menu(id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active, version, created_by, created_date, modified_by, modified_date)VALUES(uuid_generate_v4(), :parent_id, :module_name, :is_leaf, :level, :ordering, :icon, :title, :page_url, :is_active, 0, :created_by, now(), null, null) RETURNING id_menu, parent_id, module_name, is_leaf, level, ordering, icon, title, page_url, is_active;", {
        replacements:{parent_id: body.parentId, module_name: body.moduleName, is_leaf: body.isLeaf, level: body.level, ordering: body.ordering, icon: body.icon, title: body.title, page_url: body.pageUrl, is_active: body.isActive, created_by: username},
        type: model.sequelize1.QueryTypes.INSERT,
        quoteIdentifiers: true})

        return {menu_data:insert_menu}
}