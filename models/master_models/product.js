var model = require('../index');

exports.getMasterGroupProduct = async function () {

    get_product_group = await model.sequelize1.query("select * from m_product_group where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})    
        
        return {group_product: get_product_group}
}

exports.getAllProduct = async function () {

    get_all_product = await model.sequelize1.query("select * from m_product", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})    
        
        return {all_product: get_all_product}
}

exports.getProductById = async function (product_id) {

    get_product_by_id = await model.sequelize1.query("select * from m_product where product_id = :product_id", {
        replacements: {product_id: product_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})    
        
        return {get_product_by_id: get_product_by_id}
}

exports.searchProduct = async function (limit, offset, name, product_id) {

    search_product = await model.sequelize1.query("select * from m_product where (UPPER(name) = :name or UPPER(name) like :name1 or UPPER(name) like :name2 or UPPER(name) like :name3) and (product_id = :product_id or product_id like :product_id1 or product_id like :product_id2 or product_id like :product_id3) limit :limit offset :offset", {
        replacements: {limit: limit, offset:(limit*(offset-1)) ,name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', product_id: product_id, product_id1: '%'+product_id, product_id2: '%'+product_id+'%', product_id3: product_id+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})    

    data_count = await model.sequelize1.query("select count(product_id) as data_count from m_product where (UPPER(name) = :name or UPPER(name) like :name1 or UPPER(name) like :name2 or UPPER(name) like :name3) and (product_id = :product_id or product_id like :product_id1 or product_id like :product_id2 or product_id like :product_id3)", {
        replacements: {name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', product_id: product_id, product_id1: '%'+product_id, product_id2: '%'+product_id+'%', product_id3: product_id+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 
        
        return {group_product: search_product, data_count : data_count[0].data_count}
}

exports.insertProduct = async function (body, user) {

    insert_product = await model.sequelize1.query("INSERT INTO public.m_product(product_id, name, default_rate, is_active, version, created_by, created_date, product_group_id)VALUES(:product_id, :name, :default_rate, :is_active, 0, :created_by, now(), :product_group_id) returning product_id, name, default_rate, is_active, product_id;", {
        replacements: {product_id: body.productId, name: body.name, default_rate: body.defaultRate, is_active: body.isActive, created_by: user, product_group_id: body.productGroupId},
        type: model.sequelize1.QueryTypes.INSERT,
        quoteIdentifiers: true})
        
        return {insert_product: insert_product}
}

exports.updateProduct = async function (body, first_product_id, user) {

    get_product_by_id = await model.sequelize1.query("select * from m_product where product_id = :product_id", {
        replacements:{product_id: first_product_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})   

    update_product = await model.sequelize1.query("UPDATE public.m_product SET product_id = :product_id, name=:name, default_rate=:default_rate, is_active=:is_active, version=:version, modified_by=:modified_by, modified_date=now(), product_group_id=:product_group_id WHERE product_id=:first_product_id returning product_id, name, default_rate, is_active, product_id;", {
        replacements: {first_product_id: first_product_id, product_id: body.productId, name: body.name, default_rate: body.defaultRate, is_active: body.isActive, version: +get_product_by_id[0].version+1, modified_by: user, product_group_id: body.productGroupId},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {update_product: update_product}
}
