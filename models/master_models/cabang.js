var model = require('../index');

exports.getMasterWilayah = async function () {

    get_all_master_wilayah = await model.sequelize1.query("select id_wilayah, nama_wilayah from m_wilayah where is_active = true", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {get_all_master_wilayah: get_all_master_wilayah}
}

exports.getAllCabang = async function () {

    get_all_cabang = await model.sequelize1.query("select id_cabang, id_wilayah, nama_cabang, alamat_cabang, email, is_pusat, is_branch_area, kota, telp, fax, provinsi from m_cabang", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    data_count = await model.sequelize1.query("select count(id_cabang) as data_count from m_cabang", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {get_all_cabang: get_all_cabang, data_count: data_count}
}

exports.getCabangById = async function (id_cabang) {

    get_cabang_by_id = await model.sequelize1.query("select id_cabang, id_wilayah, nama_cabang, alamat_cabang, email, is_pusat, is_branch_area, kota, telp, fax, provinsi from m_cabang where id_cabang = :id_cabang", {
        replacements:{id_cabang: id_cabang},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {get_cabang_by_id: get_cabang_by_id}
}

exports.getAllCabangPaging = async function (limit, offset) {

    get_all_cabang = await model.sequelize1.query("select id_cabang, id_wilayah, nama_cabang, alamat_cabang, email, is_pusat, is_branch_area, kota, telp, fax, provinsi from m_cabang limit :limit offset :offset", {
        replacements:{limit: limit, offset: (limit*(offset-1))},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    data_count = await model.sequelize1.query("select count(id_cabang) as data_count from m_cabang", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {get_all_cabang: get_all_cabang, data_count: data_count}
}

exports.searchCabang = async function (limit, offset, id_wilayah, id_cabang, nama_cabang) {

    search_cabang = await model.sequelize1.query("select id_cabang, id_wilayah, nama_cabang, alamat_cabang, email, is_pusat, is_branch_area, kota, telp, fax, provinsi from m_cabang where (id_wilayah = :id_wilayah or id_wilayah like :id_wilayah1 or id_wilayah like :id_wilayah2 or id_wilayah like :id_wilayah3) and (id_cabang = :id_cabang or id_cabang like :id_cabang1 or id_cabang like :id_cabang2 or id_cabang like :id_cabang3) and (UPPER(nama_cabang) = :nama_cabang or UPPER(nama_cabang) like :nama_cabang1 or UPPER(nama_cabang) like :nama_cabang2 or UPPER(nama_cabang) like :nama_cabang3) limit :limit offset :offset;", {
        replacements:{limit: limit, offset: (limit*(offset-1)), id_wilayah: id_wilayah, id_wilayah1: '%'+id_wilayah, id_wilayah2: '%'+id_wilayah+'%', id_wilayah3: id_wilayah+'%', id_cabang: id_cabang, id_cabang1: '%'+id_cabang, id_cabang2: '%'+id_cabang+'%', id_cabang3: id_cabang+'%', nama_cabang: nama_cabang.toUpperCase(), nama_cabang1: '%'+nama_cabang.toUpperCase(), nama_cabang2: '%'+nama_cabang.toUpperCase()+'%', nama_cabang3: nama_cabang.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    data_count = await model.sequelize1.query("select count(id_cabang) as data_count from m_cabang where (id_wilayah = :id_wilayah or id_wilayah like :id_wilayah1 or id_wilayah like :id_wilayah2 or id_wilayah like :id_wilayah3) and (id_cabang = :id_cabang or id_cabang like :id_cabang1 or id_cabang like :id_cabang2 or id_cabang like :id_cabang3) and (UPPER(nama_cabang) = :nama_cabang or UPPER(nama_cabang) like :nama_cabang1 or UPPER(nama_cabang) like :nama_cabang2 or UPPER(nama_cabang) like :nama_cabang3);", {
        replacements:{id_wilayah: id_wilayah, id_wilayah1: '%'+id_wilayah, id_wilayah2: '%'+id_wilayah+'%', id_wilayah3: id_wilayah+'%', id_cabang: id_cabang, id_cabang1: '%'+id_cabang, id_cabang2: '%'+id_cabang+'%', id_cabang3: id_cabang+'%', nama_cabang: nama_cabang.toUpperCase(), nama_cabang1: '%'+nama_cabang.toUpperCase(), nama_cabang2: '%'+nama_cabang.toUpperCase()+'%', nama_cabang3: nama_cabang.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {get_all_cabang: search_cabang, data_count: data_count}
}

exports.updateCabang = async function (body, user) {

    get_cabang_by_id = await model.sequelize1.query("select id_cabang, id_wilayah, nama_cabang, alamat_cabang, email, is_pusat, is_branch_area, kota, telp, fax, provinsi, version from m_cabang where id_cabang = :id_cabang;", {
        replacements:{id_cabang: body.idCabang},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    update_cabang = await model.sequelize1.query("UPDATE public.m_cabang SET id_wilayah=:id_wilayah, nama_cabang=:nama_cabang, alamat_cabang=:alamat_cabang, email=:email, is_pusat=:is_pusat, is_branch_area=:is_branch_area, kota=:kota, telp=:telp, fax=:fax, provinsi=:provinsi, version=:version, modified_by=:modified_by, modified_date=now() WHERE id_cabang= :id_cabang returning id_wilayah, nama_cabang, alamat_cabang, email, is_pusat, is_branch_area, kota, telp, fax, provinsi;", {
        replacements:{id_cabang: body.idCabang, id_wilayah: body.idWilayah, nama_cabang: body.namaCabang, alamat_cabang: body.alamatCabang, email: body.email, is_pusat: body.isPusat, is_branch_area: body.isBranchArea, kota: body.kota, telp: body.telp, fax: body.fax, provinsi: body.provinsi, version: +get_cabang_by_id[0].version+1, modified_by: user},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {data: update_cabang}
}
