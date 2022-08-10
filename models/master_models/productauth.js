const baseModule = require('hbs');
var model = require('../index');

exports.getMasterProduct = async function () {

    get_product_group = await model.sequelize1.query("select * from m_product_group where product_group_id = '14' and is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})    

    for(let i = 0; i<get_product_group.length; i++)
    {
        get_product = await model.sequelize1.query("select * from m_product where product_group_id = :product_group_id and is_active = true", {
            replacements:{product_group_id: get_product_group[i].product_group_id},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true}) 

        get_product_group[i].child = get_product
    }
        
        return {master_product: get_product_group}
}

exports.getAllProductAuth = async function () {

    let get_all_product_auth = await model.sequelize1.query("select distinct a.* from m_product_auth a inner join r_product_auth_product b on a.id_product_auth = b.id_product_auth inner join m_product c on b.product_id = c.product_id where c.product_group_id = '14'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 

        return {get_all_product_auth: get_all_product_auth}
}

exports.getProductAuthById = async function (id_product_auth) {

    let get_group_product = await model.sequelize1.query("select * from m_product_group where is_active = true and product_group_id = '14'", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let get_product_auth_by_id = await model.sequelize1.query("select a.id_product_auth, c.product_id, c.product_group_id , a.name as product_auth_name, a.is_active, c.name as product_name from m_product_auth a inner join r_product_auth_product b on a.id_product_auth = b.id_product_auth inner join m_product c on b.product_id = c.product_id where a.id_product_auth = :id_product_auth and c.is_active = true", {
        replacements:{id_product_auth: id_product_auth},
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

        return {get_product_auth_by_id: get_group_product}
}

exports.getAllProductAuthPaging = async function (limit, offset) {

    let get_all_product_auth = await model.sequelize1.query("select distinct a.* from m_product_auth  a inner join r_product_auth_product b on a.id_product_auth = b.id_product_auth inner join m_product c on b.product_id = c.product_id where c.product_group_id = '14' limit :limit offset :offset", {
        replacements:{limit: limit, offset: (limit*(offset-1))},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

        return {get_all_product_auth: get_all_product_auth, data_count: get_all_product_auth.length}
}

exports.searchProductAuth = async function (body) {

    search_product_auth = await model.sequelize1.query("select * from m_product_auth where id_product_auth = :id_product_auth", {
        replacements: {id_product_auth: body.idProductAuth},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true}) 

        return {search_product_auth: search_product_auth}
}

exports.insertProductAuth = async function (body, user) {

    let insert_product_auth = await model.sequelize1.query("INSERT INTO public.m_product_auth(id_product_auth, name, is_active, version, created_by, created_date) VALUES(uuid_generate_v4(), :name, :is_active, 0, :created_by, now()) returning id_product_auth, name, is_active;", {
        replacements: {name: body.name, is_active: body.isActive, created_by: user},
        type: model.sequelize1.QueryTypes.INSERT,
        quoteIdentifiers: true})
    
    for(let i = 0; i < body.productId.length; i++)
    {
        await model.sequelize1.query("INSERT INTO public.r_product_auth_product(id_product_auth, product_id)VALUES(:id_product_auth, :product_id);", {
            replacements: {id_product_auth: insert_product_auth[0][0].id_product_auth, product_id: body.productId[i]},
            type: model.sequelize1.QueryTypes.INSERT,
            quoteIdentifiers: true})
    }

        return {insert_product_auth: insert_product_auth}
}

exports.updateProductAuth = async function (body, user) {

    get_product_auth_by_id = await model.sequelize1.query("select * from m_product_auth where id_product_auth = :id_product_auth;", {
        replacements: {id_product_auth: body.idProductAuth},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    update_product_auth = await model.sequelize1.query("UPDATE public.m_product_auth SET name=:name, is_active=:is_active, version=:version, modified_by=:modified_by, modified_date=now() WHERE id_product_auth=:id_product_auth returning id_product_auth, name, is_active;", {
        replacements: {id_product_auth : body.idProductAuth, name: body.name, is_active: body.isActive, version: +get_product_auth_by_id[0].version+1, modified_by: user},
        type: model.sequelize1.QueryTypes.UPDATE,
        quoteIdentifiers: true})

    get_product_not_include = await model.sequelize1.query("select * from r_product_auth_product where product_id not in(:product_id) and id_product_auth = :id_product_auth", {
        replacements:{product_id: body.productId, id_product_auth: body.idProductAuth},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    if(get_product_not_include[0])
    {
        delete_user_role_not_include = await model.sequelize1.query("delete from r_product_auth_product where product_id not in(:product_id) and id_product_auth = :id_product_auth", {
            replacements:{product_id: body.productId, id_product_auth: body.idProductAuth},
            type: model.sequelize1.QueryTypes.DELETE,
            quoteIdentifiers: true})
    }
    
    for(let i = 0; i<body.productId.length; i++)
    {
        get_r_product_id = await model.sequelize1.query("select * from r_product_auth_product where product_id = :product_id and id_product_auth = :id_product_auth", {
            replacements:{product_id: body.productId[i], id_product_auth: body.idProductAuth},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
        if(!get_r_product_id[0])
        {
            await model.sequelize1.query("INSERT INTO public.r_product_auth_product(id_product_auth, product_id)VALUES(:id_product_auth, :product_id);", {
                replacements: {id_product_auth: body.idProductAuth, product_id: body.productId[i]},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true})
        }  
    }

        return {update_product_auth: update_product_auth}
}