const { create } = require('hbs');
var model = require('../index');

exports.getRoleByName = async function (role_name) {

    role_by_name = await model.sequelize1.query("select role_name, keterangan, is_active, version from m_role where role_name = :role_name;", {
        replacements:{role_name: role_name},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {role_data:role_by_name}
}

exports.getAllRole = async function () {

    all_role = await model.sequelize1.query("select role_name, keterangan, is_active from m_role;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    count_data = await model.sequelize1.query("select count(role_name) as data_count from m_role;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {role_data:all_role, count_data: count_data[0]}
}

exports.postSearchRole = async function (limit, offset, role_name) {

    search_role = await model.sequelize1.query("select a.role_name, a.keterangan, a.is_active from m_role a where (UPPER(a.role_name) = :role_name or UPPER(a.role_name) like :role_name1 or UPPER(a.role_name) like :role_name2 or UPPER(a.role_name) like :role_name3) limit :limit offset :offset", {
        replacements: {limit: limit, offset: (limit*(offset-1)), role_name: role_name.toUpperCase(), role_name1: '%'+role_name.toUpperCase(), role_name2: '%'+role_name.toUpperCase()+'%', role_name3: role_name.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    count_data = await model.sequelize1.query("select count(a.role_name) as data_count from m_role a where (UPPER(a.role_name) = :role_name or UPPER(a.role_name) like :role_name1 or UPPER(a.role_name) like :role_name2 or UPPER(a.role_name) like :role_name3);", {
        replacements: {role_name: role_name.toUpperCase(), role_name1: '%'+role_name.toUpperCase(), role_name2: '%'+role_name.toUpperCase()+'%', role_name3: role_name.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {role_data:search_role, count_data: count_data[0]}
}

exports.postInsertRole = async function (role_name, keterangan, created_by, is_active) {

    role_name_check = await model.sequelize1.query("select * from m_role where role_name = :role_name;", {
        replacements: {role_name: role_name},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    if(!role_name_check.length)
    {
        insert_role = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; INSERT INTO m_role(role_name, keterangan, is_active, version, created_by, created_date, modified_by, modified_date)VALUES(:role_name, :keterangan, :is_active, 0, :created_by, now(), NULL, NULL) RETURNING role_name, keterangan, is_active;", {
            replacements: {role_name: role_name, keterangan: keterangan, created_by: created_by, is_active: is_active},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
    }
    else
    {
        insert_role = false
    }

        return {role_data: insert_role}
}

exports.putUpdateRole = async function (role_name, keterangan, created_by, is_active, role_name_primary) {

    select_role = await this.getRoleByName(role_name_primary)
    role_name_check = await model.sequelize1.query("select * from m_role where role_name = :role_name;", {
        replacements: {role_name: role_name},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    if(!role_name_check.length || role_name == role_name_primary)
    {
        update_role = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok'; UPDATE m_role SET role_name = :role_name, version = :version, keterangan = :keterangan, is_active = :is_active, modified_by = :modified_by, modified_date = now() WHERE role_name= :role_name_primary RETURNING role_name, keterangan, is_active;", {
            replacements: {role_name: role_name, version: +select_role.role_data[0].version+1, keterangan: keterangan, modified_by: created_by, is_active: is_active, role_name_primary: role_name_primary},
            type: model.sequelize1.QueryTypes.UPDATE,
            quoteIdentifiers: true})
    }
    else
    {
        update_role = false
    }

        return {role_data: update_role}
}