var model = require('../index');

exports.getMasterBPType = async function () {

    get_all_master_bp_type = await model.sequelize2.query("select DISTINCT a.PARTNER_TYPE_ID , b.NAME from CUSTOMER.CUS_BP a inner join customer.M_PARTNER_TYPE b on a.PARTNER_TYPE_ID = b.PARTNER_TYPE_ID where a.IS_ACTIVE = 1 and b.IS_ACTIVE = 1;", {
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})
        
        return {bp_type: get_all_master_bp_type}
}

exports.getAllBP = async function () {

    all_bp = await model.sequelize1.query("select a.id_bp, a.id_no, a.partner_type_id, a.name, a.npwp, a.cif_no from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN');", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    data_count = await model.sequelize1.query("select count(a.id_bp) as data_count from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN');", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_agen:all_bp, count_data: data_count[0]}
}

exports.getJenisDokumen = async function () {
    jenis_dokumen_bp = await model.sequelize1.query("select lookup_key, key_only, label from m_lookup where lookup_group = 'DOKUMEN_BP';", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {jenis_dokumen_bp: jenis_dokumen_bp}
}

exports.getAllBPPaging = async function (limit, offset) {

    all_bp_paging = await model.sequelize1.query("select a.id_no, a.partner_type_id, a.name, a.npwp, a.cif_no from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN') limit :limit offset :offset;", {
        replacements: {limit: limit, offset: (limit*(offset-1))},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    data_count = await model.sequelize1.query("select count(a.id_bp) as data_count from m_bussiness_partner a where a.partner_type_id IN ('AGENT','AGENT.INDIVIDU','AGENT.PERUSAHAAN');", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_agen:all_bp_paging, count_data: data_count[0]}
}

exports.searchBP = async function (limit, offset, partner_type_id, name, npwp, id_no, cif_no) {

    user_agen = await model.sequelize1.query("select a.id_bp, a.id_no, a.partner_type_id, a.name, a.npwp, a.cif_no from m_bussiness_partner a where (a.partner_type_id is null or UPPER(a.partner_type_id) = :partner_type_id or UPPER(a.partner_type_id) like :partner_type_id1 or UPPER(a.partner_type_id) like :partner_type_id2 or UPPER(a.partner_type_id) like :partner_type_id3) and ((a.name is null or UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp is null or a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no is null or a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no is null or a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3)) limit :limit offset :offset;", {
        replacements: {limit: limit, offset: (limit*(offset-1)), partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp.toUpperCase(), npwp1: '%'+npwp.toUpperCase(), npwp2: '%'+npwp.toUpperCase()+'%', npwp3: npwp.toUpperCase()+'%', id_no: id_no.toUpperCase(), id_no1: '%'+id_no.toUpperCase(), id_no2: '%'+id_no.toUpperCase()+'%', id_no3: id_no.toUpperCase()+'%', cif_no: cif_no.toUpperCase(), cif_no1: '%'+cif_no.toUpperCase(), cif_no2: '%'+cif_no.toUpperCase()+'%', cif_no3: cif_no.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    data_count = await model.sequelize1.query("select count(a.id_bp) as data_count from m_bussiness_partner a where (a.partner_type_id is null or UPPER(a.partner_type_id) = :partner_type_id or UPPER(a.partner_type_id) like :partner_type_id1 or UPPER(a.partner_type_id) like :partner_type_id2 or UPPER(a.partner_type_id) like :partner_type_id3) and ((a.name is null or UPPER(a.name) = :name or UPPER(a.name) like :name1 or UPPER(a.name) like :name2 or UPPER(a.name) like :name3) and (a.npwp is null or a.npwp = :npwp or a.npwp like :npwp1 or a.npwp like :npwp2 or a.npwp like :npwp3) and (a.id_no is null or a.id_no = :id_no or a.id_no like :id_no1 or a.id_no like :id_no2 or a.id_no like :id_no3) and (a.cif_no is null or a.cif_no = :cif_no or a.cif_no like :cif_no1 or a.cif_no like :cif_no2 or a.cif_no like :cif_no3));", {
        replacements: {partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp.toUpperCase(), npwp1: '%'+npwp.toUpperCase(), npwp2: '%'+npwp.toUpperCase()+'%', npwp3: npwp.toUpperCase()+'%', id_no: id_no.toUpperCase(), id_no1: '%'+id_no.toUpperCase(), id_no2: '%'+id_no.toUpperCase()+'%', id_no3: id_no.toUpperCase()+'%', cif_no: cif_no.toUpperCase(), cif_no1: '%'+cif_no.toUpperCase(), cif_no2: '%'+cif_no.toUpperCase()+'%', cif_no3: cif_no.toUpperCase()+'%'},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {user_agen:user_agen, count_data: data_count[0]}
}

exports.lookupBP = async function (limit, offset, partner_type_id, name, npwp, id_no, cif_no) {

    lookup_bp = await model.sequelize2.query("SELECT BP.BP_ID as id_bp, BP.CIF_NO as cif_no, BP.PARTNER_TYPE_ID as partner_type_id, BP.NAME as name, BP_ADD.ADDRESS as address, BP_ADD.ZIP_CODE as zip_code , BP.NPWP as npwp, BP.ID_NO as id_no, BP.IS_ACTIVE as is_active, BP.VERSION as version FROM CUSTOMER.CUS_BP BP INNER JOIN CUSTOMER.CUS_BP_ADDRESS BP_ADD ON BP.BP_ID = BP_ADD.BP_ID AND BP_ADD.IS_PRIMARY = '1' WHERE BP.IS_ACTIVE = '1' AND (BP.PARTNER_TYPE_ID is null or UPPER(BP.PARTNER_TYPE_ID) = :partner_type_id or UPPER(BP.PARTNER_TYPE_ID) like :partner_type_id1 or UPPER(BP.PARTNER_TYPE_ID) like :partner_type_id2 or UPPER(BP.PARTNER_TYPE_ID) like :partner_type_id3) AND ((UPPER(BP.CIF_NO) = :cif_no or UPPER(BP.CIF_NO) like :cif_no1 or UPPER(BP.CIF_NO) like :cif_no2 or UPPER(BP.CIF_NO) like :cif_no3) AND (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) AND (UPPER(BP.NPWP) = :npwp or UPPER(BP.NPWP) like :npwp1 or UPPER(BP.NPWP) like :npwp2 or UPPER(BP.NPWP) like :npwp3) AND (UPPER(BP.ID_NO) = :id_no or UPPER(BP.ID_NO) LIKE :id_no1 or UPPER(BP.ID_NO) LIKE :id_no2 or UPPER(BP.ID_NO) LIKE :id_no3)) ORDER BY BP.BP_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
        replacements: {limit: +limit, offset: (limit*(offset-1)), partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp.toUpperCase(), npwp1: '%'+npwp.toUpperCase(), npwp2: '%'+npwp.toUpperCase()+'%', npwp3: npwp.toUpperCase()+'%', id_no: id_no.toUpperCase(), id_no1: '%'+id_no.toUpperCase(), id_no2: '%'+id_no.toUpperCase()+'%', id_no3: id_no.toUpperCase()+'%', cif_no: cif_no.toUpperCase(), cif_no1: '%'+cif_no.toUpperCase(), cif_no2: '%'+cif_no.toUpperCase()+'%', cif_no3: cif_no.toUpperCase()+'%'},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    data_count = await model.sequelize2.query("SELECT count(BP.BP_ID) as data_count FROM CUSTOMER.CUS_BP BP INNER JOIN CUSTOMER.CUS_BP_ADDRESS BP_ADD ON BP.BP_ID = BP_ADD.BP_ID AND BP_ADD.IS_PRIMARY = '1' WHERE BP.IS_ACTIVE = '1' AND (BP.PARTNER_TYPE_ID is null or UPPER(BP.PARTNER_TYPE_ID) = :partner_type_id or UPPER(BP.PARTNER_TYPE_ID) like :partner_type_id1 or UPPER(BP.PARTNER_TYPE_ID) like :partner_type_id2 or UPPER(BP.PARTNER_TYPE_ID) like :partner_type_id3) AND ((UPPER(BP.CIF_NO) = :cif_no or UPPER(BP.CIF_NO) like :cif_no1 or UPPER(BP.CIF_NO) like :cif_no2 or UPPER(BP.CIF_NO) like :cif_no3) AND (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) AND (UPPER(BP.NPWP) = :npwp or UPPER(BP.NPWP) like :npwp1 or UPPER(BP.NPWP) like :npwp2 or UPPER(BP.NPWP) like :npwp3) AND (UPPER(BP.ID_NO) = :id_no or UPPER(BP.ID_NO) LIKE :id_no1 or UPPER(BP.ID_NO) LIKE :id_no2 or UPPER(BP.ID_NO) LIKE :id_no3));", {
        replacements: {partner_type_id: partner_type_id.toUpperCase(), partner_type_id1: '%'+partner_type_id.toUpperCase(), partner_type_id2: '%'+partner_type_id.toUpperCase()+'%', partner_type_id3: partner_type_id.toUpperCase()+'%', name: name.toUpperCase(), name1: '%'+name.toUpperCase(), name2: '%'+name.toUpperCase()+'%', name3: name.toUpperCase()+'%', npwp: npwp.toUpperCase(), npwp1: '%'+npwp.toUpperCase(), npwp2: '%'+npwp.toUpperCase()+'%', npwp3: npwp.toUpperCase()+'%', id_no: id_no.toUpperCase(), id_no1: '%'+id_no.toUpperCase(), id_no2: '%'+id_no.toUpperCase()+'%', id_no3: id_no.toUpperCase()+'%', cif_no: cif_no.toUpperCase(), cif_no1: '%'+cif_no.toUpperCase(), cif_no2: '%'+cif_no.toUpperCase()+'%', cif_no3: cif_no.toUpperCase()+'%'},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {lookup_bp: lookup_bp, count_data: data_count[0]}
}

exports.getBPACSById = async function (bp_id) {

    get_bp_by_id = await model.sequelize2.query("SELECT BP.BP_ID as id_bp, BP.CIF_NO as cif_no, BP.PARTNER_TYPE_ID as partner_type_id, BP.NAME as name, BP_ADD.ADDRESS as address, BP_ADD.ZIP_CODE as zip_code , BP.NPWP as npwp, BP.ID_NO as id_no, BP.IS_ACTIVE as is_active, BP.VERSION as version FROM CUSTOMER.CUS_BP BP INNER JOIN CUSTOMER.CUS_BP_ADDRESS BP_ADD ON BP.BP_ID = BP_ADD.BP_ID AND BP_ADD.IS_PRIMARY = '1' WHERE BP.BP_ID = :bp_id", {
        replacements: {bp_id: bp_id},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    get_pks_by_id = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE as start_date, PKS.END_DATE as end_date, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE as is_active, PKS.VERSION as version, PKS_PRODUK.PRODUCT_ID as product_id, PKS_PRODUK.JSON_DATA AS pks_produk_json_data FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_AGREEMENT_PRODUCT PKS_PRODUK ON PKS.AGREEMENT_ID = PKS_PRODUK.AGREEMENT_ID WHERE PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' and PKS.PARTY_ID = :bp_id;", {
        replacements: {bp_id: bp_id},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_file_bp = await model.sequelize1.query("select b.* from m_bp_dokumen b where b.is_active=true and b.id_bp = :bp_id;", {
        replacements: {bp_id: bp_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {data_bp: get_bp_by_id, data_pks: get_pks_by_id, data_dokumen: get_file_bp}
}

exports.getBPById = async function (bp_id) {

    get_bp_by_id = await model.sequelize1.query("select * from m_bussiness_partner where id_bp = :bp_id", {
        replacements: {bp_id: bp_id},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    get_pks_by_id = await model.sequelize1.query("select * from m_pks where id_bp = :bp_id;", {
        replacements: {bp_id: bp_id},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})

    get_file_bp = await model.sequelize1.query("select b.* from m_bp_dokumen b where b.is_active=true and b.id_bp = :bp_id;", {
        replacements: {bp_id: bp_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {data_bp: get_bp_by_id, data_pks: get_pks_by_id, data_dokumen: get_file_bp}
}

exports.insertBP = async function (body, created_by) {
    
    return await model.sequelize1.transaction(async (t) => {
        let product_id_arr = []
        get_bp_by_id = await model.sequelize1.query("select * from m_bussiness_partner where id_bp = :id_bp;", {
            replacements: {id_bp: body.idBp.toLowerCase().trim()},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true, transaction: t})

        if(!get_bp_by_id.length)
        {
            insert_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bussiness_partner(id_bp, cif_no, partner_type_id, name, address, zipcode, npwp, id_no, is_active, version, created_by, created_date)VALUES(:id_bp, :cif_no, :partner_type_id, :name, :address, :zip_code, :npwp, :id_no, :is_active, :version, :created_by, now()) returning id_bp, cif_no, partner_type_id, name, address, zipcode, npwp, id_no;", {
                replacements: {id_bp: body.idBp.toLowerCase().trim(), cif_no: body.cifNo, partner_type_id: body.partnerTypeId, name: body.name, address: body.address, zip_code: body.zipCode, npwp: body.npwp.replace(/[^0-9a-z]/gi, ""), id_no: body.idNo, is_active: body.isActive, version: body.version, created_by: created_by},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true, transaction: t})
            
            for(let i = 0; i < body.pks.length; i++)
            {
                product_id_arr.push(body.pks[i].productId.trim())
            }

            get_pks_by_id = await model.sequelize1.query("select * from m_pks where id_pks = :id_pks;", {
                replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim()},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})

            if(!get_pks_by_id.length)
            {
                insert_pks = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_pks(id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active, version, created_by, created_date)VALUES(:id_pks, :id_bp, :jenis_pks, :no_pks, :tgl_pks, :start_date, :end_date, :json_data, :is_active, :version, :created_by, now());", {
                    replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), id_bp: body.idBp, jenis_pks: body.pks[0].jenisPks, no_pks: body.pks[0].noPks, tgl_pks: body.pks[0].tglPks, start_date: body.pks[0].startDate, end_date: body.pks[0].endDate, json_data: body.pks[0].pksJsonData, is_active: body.pks[0].isActive, version: body.pks[0].version, created_by: created_by},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t})
            }
            else
            {
                if(get_pks_by_id[0].version < body.pks[0].version)
                {
                    update_pks = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';UPDATE public.m_pks SET id_bp=:id_bp, jenis_pks=:jenis_pks, no_pks=:no_pks, tgl_pks=:tgl_pks, start_date=:start_date, end_date=:end_date, json_data=:json_data, is_active=:is_active, version=:version, modified_by=:created_by, modified_date=now() WHERE id_pks=:id_pks returning id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active;", {
                        replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), id_bp: body.idBp, jenis_pks: body.pks[0].jenisPks, no_pks: body.pks[0].noPks, tgl_pks: body.pks[0].tglPks, start_date: body.pks[0].startDate, end_date: body.pks[0].endDate, json_data: body.pks[0].pksJsonData, is_active: body.pks[0].isActive, version: body.pks[0].version, created_by: created_by},
                        type: model.sequelize1.QueryTypes.UPDATE,
                        quoteIdentifiers: true, transaction: t}) 
                }
            }

            get_r_pks_product_not_include = await model.sequelize1.query("select * from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), product_id : product_id_arr},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(get_r_pks_product_not_include.length)
            {
                await model.sequelize1.query("delete from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                    replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), product_id : product_id_arr},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
            }

            for(let i = 0; i < body.pks.length; i++)
            {
                get_r_pks_product = await model.sequelize1.query("select * from r_pks_product where product_id = :product_id and id_pks = :id_pks", {
                    replacements: {id_pks: body.pks[i].idPks.toLowerCase().trim(), product_id: body.pks[i].productId},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(!get_r_pks_product.length)
                insert_r_pks_product = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.r_pks_product(id_pks, product_id, json_data)VALUES(:id_pks, :product_id, :json_data);", {
                    replacements: {id_pks: body.pks[i].idPks.toLowerCase().trim(), json_data: body.pks[i].pksProdukJsonData, product_id: body.pks[i].productId},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t})
            }
            if(body.fileId.length)
            {
                get_bp_dokumen = await model.sequelize1.query("select * from m_bp_dokumen where id_bp = :id_bp;", {
                    replacements: {id_bp: body.idBp},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(get_bp_dokumen.length)
                {
                    for(let i = 0; i < body.jenisDokumen.length; i++)
                    {
                        if(get_bp_dokumen.filter(value => value.jenis_dokumen == body.jenisDokumen[i]).length)
                        {
                            update_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update m_bp_dokumen set is_active = false, modified_by = :modified_by, modified_date = now() where jenis_dokumen = :jenis_dokumen and id_bp = :id_bp;", {
                                replacements: {id_bp: body.idBp, jenis_dokumen: body.jenisDokumen[i], modified_by:created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                            
                            insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bp_dokumen(id_bp_dokumen, id_bp, ururtan, file_id, jenis_dokumen, keterangan, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :id_bp, :urutan, :file_id, :jenis_dokumen, :keterangan, true, 0, :created_by, now());", {
                                replacements: {id_bp: body.idBp, urutan: get_bp_dokumen.filter(value => value.jenis_dokumen == body.jenisDokumen[i])[0].ururtan, file_id: body.fileId[i], jenis_dokumen: body.jenisDokumen[i], keterangan: body.keterangan[i], created_by: created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                        else
                        {
                            get_max_urutan = await model.sequelize1.query("select max(ururtan) as urutan from m_bp_dokumen where id_bp = :id_bp;", {
                                replacements: {id_bp: body.idBp},
                                type: model.sequelize1.QueryTypes.SELECT,
                                quoteIdentifiers: true, transaction: t})
                            
                            insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bp_dokumen(id_bp_dokumen, id_bp, ururtan, file_id, jenis_dokumen, keterangan, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :id_bp, :urutan, :file_id, :jenis_dokumen, :keterangan, true, 0, :created_by, now());", {
                                replacements: {id_bp: body.idBp, urutan: +get_max_urutan[0].urutan+1, file_id: body.fileId[i], jenis_dokumen: body.jenisDokumen[i], keterangan: body.keterangan[i], created_by: created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                    }
                }
                else
                {
                    for(let i = 0; i<body.fileId.length; i++)
                    {
                        insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bp_dokumen(id_bp_dokumen, id_bp, ururtan, file_id, jenis_dokumen, keterangan, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :id_bp, :urutan, :file_id, :jenis_dokumen, :keterangan, true, 0, :created_by, now());", {
                            replacements: {id_bp: body.idBp, urutan: i+1, file_id: body.fileId[i], jenis_dokumen: body.jenisDokumen[i], keterangan: body.keterangan[i], created_by: created_by},
                            type: model.sequelize1.QueryTypes.INSERT,
                            quoteIdentifiers: true, transaction: t})
                    }
                }
            }

            return {data_bp: insert_bp}
        }
        else
        {
            if(body.fileId.length)
            {
                get_bp_dokumen = await model.sequelize1.query("select * from m_bp_dokumen where id_bp = :id_bp;", {
                    replacements: {id_bp: body.idBp},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(get_bp_dokumen.length)
                {
                    for(let i = 0; i < body.jenisDokumen.length; i++)
                    {
                        get_bp_dokumen = await model.sequelize1.query("select * from m_bp_dokumen where id_bp = :id_bp;", {
                            replacements: {id_bp: body.idBp},
                            type: model.sequelize1.QueryTypes.SELECT,
                            quoteIdentifiers: true, transaction: t})
                        if(get_bp_dokumen.filter(value => value.jenis_dokumen == body.jenisDokumen[i]).length)
                        {
                            console.log(get_bp_dokumen.filter(value => value.jenis_dokumen == body.jenisDokumen[i]))
                            update_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update m_bp_dokumen set is_active = false, modified_by = :modified_by, modified_date = now() where jenis_dokumen = :jenis_dokumen and id_bp = :id_bp;", {
                                replacements: {id_bp: body.idBp, jenis_dokumen: body.jenisDokumen[i], modified_by:created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                            
                            insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bp_dokumen(id_bp_dokumen, id_bp, ururtan, file_id, jenis_dokumen, keterangan, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :id_bp, :urutan, :file_id, :jenis_dokumen, :keterangan, true, 0, :created_by, now());", {
                                replacements: {id_bp: body.idBp, urutan: get_bp_dokumen.filter(value => value.jenis_dokumen == body.jenisDokumen[i])[0].ururtan, file_id: body.fileId[i], jenis_dokumen: body.jenisDokumen[i], keterangan: body.keterangan[i], created_by: created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                        else
                        {
                            get_max_urutan = await model.sequelize1.query("select max(ururtan) as urutan from m_bp_dokumen where id_bp = :id_bp;", {
                                replacements: {id_bp: body.idBp},
                                type: model.sequelize1.QueryTypes.SELECT,
                                quoteIdentifiers: true, transaction: t})
                            
                            insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bp_dokumen(id_bp_dokumen, id_bp, ururtan, file_id, jenis_dokumen, keterangan, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :id_bp, :urutan, :file_id, :jenis_dokumen, :keterangan, true, 0, :created_by, now());", {
                                replacements: {id_bp: body.idBp, urutan: +get_max_urutan[0].urutan+1, file_id: body.fileId[i], jenis_dokumen: body.jenisDokumen[i], keterangan: body.keterangan[i], created_by: created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                    }
                }
                else
                {
                    for(let i = 0; i<body.fileId.length; i++)
                    {
                        get_bp_dokumen_new = await model.sequelize1.query("select * from m_bp_dokumen where id_bp = :id_bp;", {
                            replacements: {id_bp: body.idBp},
                            type: model.sequelize1.QueryTypes.SELECT,
                            quoteIdentifiers: true, transaction: t})
                        if(get_bp_dokumen_new.filter(value => value.jenis_dokumen == body.jenisDokumen[i]).length)
                        {
                            update_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update m_bp_dokumen set is_active = false, modified_by = :modified_by, modified_date = now() where jenis_dokumen = :jenis_dokumen and id_bp = :id_bp;", {
                                replacements: {id_bp: body.idBp, jenis_dokumen: body.jenisDokumen[i], modified_by:created_by},
                                type: model.sequelize1.QueryTypes.INSERT,
                                quoteIdentifiers: true, transaction: t})
                        }
                        insert_data_dok = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bp_dokumen(id_bp_dokumen, id_bp, ururtan, file_id, jenis_dokumen, keterangan, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :id_bp, :urutan, :file_id, :jenis_dokumen, :keterangan, true, 0, :created_by, now());", {
                            replacements: {id_bp: body.idBp, urutan: i+1, file_id: body.fileId[i], jenis_dokumen: body.jenisDokumen[i], keterangan: body.keterangan[i], created_by: created_by},
                            type: model.sequelize1.QueryTypes.INSERT,
                            quoteIdentifiers: true, transaction: t})
                    }
                }
            }
            if(get_bp_by_id[0].version < body.version)
            {
                update_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';UPDATE public.m_bussiness_partner set cif_no = :cif_no, partner_type_id = :partner_type_id, name = :name, address = :address, zipcode = :zip_code, npwp = :npwp, id_no = :id_no, is_active = :is_active, version = :version, modified_by = :modified_by, modified_date = now() where id_bp = :id_bp returning id_bp, cif_no, partner_type_id, name, address, zipcode, npwp, id_no;", {
                    replacements: {id_bp: body.idBp.toLowerCase().trim(), cif_no: body.cifNo, partner_type_id: body.partnerTypeId, name: body.name, address: body.address, zip_code: body.zipCode, npwp: body.npwp.replace(/[^0-9a-z]/gi, ""), id_no: body.idNo, is_active: body.isActive, version: body.version, modified_by: created_by},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true, transaction: t})
            }

            get_pks_by_id = await model.sequelize1.query("select * from m_pks where id_pks = :id_pks;", {
                replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim()},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true, transaction: t})
            if(get_pks_by_id.length)
            {
                if(get_pks_by_id[0].version < body.pks[0].version)
                {
                    update_pks = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';UPDATE public.m_pks SET id_bp=:id_bp, jenis_pks=:jenis_pks, no_pks=:no_pks, tgl_pks=:tgl_pks, start_date=:start_date, end_date=:end_date, json_data=:json_data, is_active=:is_active, version=:version, modified_by=:created_by, modified_date=now() WHERE id_pks=:id_pks returning id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active;", {
                        replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), id_bp: body.idBp, jenis_pks: body.pks[0].jenisPks, no_pks: body.pks[0].noPks, tgl_pks: body.pks[0].tglPks, start_date: body.pks[0].startDate, end_date: body.pks[0].endDate, json_data: body.pks[0].pksJsonData, is_active: body.pks[0].isActive, version: body.pks[0].version, created_by: created_by},
                        type: model.sequelize1.QueryTypes.UPDATE,
                        quoteIdentifiers: true, transaction: t}) 

                    for(let i = 0; i < body.pks.length; i++)
                    {
                        product_id_arr.push(body.pks[i].productId.trim())
                    }

                    get_r_pks_product_not_include = await model.sequelize1.query("select * from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                        replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), product_id : product_id_arr},
                        type: model.sequelize1.QueryTypes.SELECT,
                        quoteIdentifiers: true, transaction: t})
                    if(get_r_pks_product_not_include.length)
                    {
                        await model.sequelize1.query("delete from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                            replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), product_id : product_id_arr},
                            type: model.sequelize1.QueryTypes.DELETE,
                            quoteIdentifiers: true, transaction: t})
                    }
            
                    for(let i = 0; i < body.pks.length; i++)
                    {
                        get_r_pks_product = await model.sequelize1.query("select * from r_pks_product where product_id = :product_id and id_pks = :id_pks", {
                            replacements: {id_pks: body.pks[i].idPks.toLowerCase().trim(), product_id: body.pks[i].productId},
                            type: model.sequelize1.QueryTypes.SELECT,
                            quoteIdentifiers: true, transaction: t})
                        if(!get_r_pks_product.length)
                        insert_r_pks_product = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.r_pks_product(id_pks, product_id, json_data)VALUES(:id_pks, :product_id, :json_data);", {
                            replacements: {id_pks: body.pks[i].idPks.toLowerCase().trim(), json_data: body.pks[i].pksProdukJsonData, product_id: body.pks[i].productId},
                            type: model.sequelize1.QueryTypes.INSERT,
                            quoteIdentifiers: true, transaction: t})
                    }
                    return {data_bp: update_pks}
                }
                else
                {
                    return {data_bp: false}
                }
            }
            else
            {
                for(let i = 0; i < body.pks.length; i++)
                {
                    product_id_arr.push(body.pks[i].productId.trim())
                }

                insert_pks = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_pks(id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active, version, created_by, created_date)VALUES(:id_pks, :id_bp, :jenis_pks, :no_pks, :tgl_pks, :start_date, :end_date, :json_data, :is_active, :version, :created_by, now()) returning id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active;", {
                    replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), id_bp: body.idBp, jenis_pks: body.pks[0].jenisPks, no_pks: body.pks[0].noPks, tgl_pks: body.pks[0].tglPks, start_date: body.pks[0].startDate, end_date: body.pks[0].endDate, json_data: body.pks[0].pksJsonData, is_active: body.pks[0].isActive, version: body.pks[0].version, created_by: created_by},
                    type: model.sequelize1.QueryTypes.INSERT,
                    quoteIdentifiers: true, transaction: t})

                get_r_pks_product_not_include = await model.sequelize1.query("select * from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                    replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), product_id : product_id_arr},
                    type: model.sequelize1.QueryTypes.SELECT,
                    quoteIdentifiers: true, transaction: t})
                if(get_r_pks_product_not_include.length)
                {
                    await model.sequelize1.query("delete from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                        replacements: {id_pks: body.pks[0].idPks.toLowerCase().trim(), product_id : product_id_arr},
                        type: model.sequelize1.QueryTypes.SELECT,
                        quoteIdentifiers: true, transaction: t})
                }

                for(let i = 0; i < body.pks.length; i++)
                {
                    get_r_pks_product = await model.sequelize1.query("select * from r_pks_product where product_id = :product_id and id_pks = :id_pks", {
                        replacements: {id_pks: body.pks[i].idPks.toLowerCase().trim(), product_id: body.pks[i].productId},
                        type: model.sequelize1.QueryTypes.SELECT,
                        quoteIdentifiers: true, transaction: t})
                    if(!get_r_pks_product.length)
                    insert_r_pks_product = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.r_pks_product(id_pks, product_id, json_data)VALUES(:id_pks, :product_id, :json_data);", {
                        replacements: {id_pks: body.pks[i].idPks.toLowerCase().trim(), json_data: body.pks[i].pksProdukJsonData, product_id: body.pks[i].productId},
                        type: model.sequelize1.QueryTypes.INSERT,
                        quoteIdentifiers: true, transaction: t})
                }
                return {data_bp: insert_bp}
            }
        }
    })   
}

exports.insertBPDoc = async function (body, created_by) {
    return await model.sequelize1.transaction(async (t) => {
        insert_dok_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO t_file(file_id, file_name, file_type, file_extention, file_size, data_file, is_active, version, created_by, created_date)VALUES(uuid_generate_v4(), :file_name, :file_type, :file_extention, :file_size, :data_file, true, 0, '', now()) returning file_id, file_name, file_type, file_extention, file_size;", {
            replacements: {file_name: body.originalname, file_type:body.mimetype, file_extention: body.originalname.substring(body.originalname.lastIndexOf('.'), body.originalname.length), file_size: body.size, data_file: body.buffer, created_by: created_by},
            type: model.sequelize1.QueryTypes.INSERT,
            quoteIdentifiers: true, transaction: t})
        
        return {insert_dok_bp: insert_dok_bp}
    })
}

exports.viewBPDoc = async function (file_id) {

    view_dok_bp = await model.sequelize1.query("select * from t_file where file_id = :file_id;", {
        replacements: {file_id: file_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    
    return {view_dok_bp: view_dok_bp}
}

exports.deleteBPDoc = async function (file_id, created_by) {

    cek_dok  = await model.sequelize1.query("select * from t_file where file_id = :file_id;", {
        replacements: {file_id: file_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    cek_bp  = await model.sequelize1.query("select * from m_bp_dokumen where file_id = :file_id;", {
        replacements: {file_id: file_id},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
        var delete_dok_bp
        if(cek_bp.length)
        {
            await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update t_file set is_active = false, version = :version, modified_date=now(), modified_by=:modified_by where file_id = :file_id returning file_id;", {
                replacements: {file_id: file_id, version: +cek_dok[0].version+1, modified_by: created_by},
                type: model.sequelize1.QueryTypes.UPDATE,
                quoteIdentifiers: true})

            delete_dok_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update m_bp_dokumen set is_active = false, version = :version, modified_date=now(), modified_by=:modified_by where file_id = :file_id returning id_bp;", {
                replacements: {file_id: file_id, version: +cek_bp[0].version+1, modified_by:created_by},
                type: model.sequelize1.QueryTypes.UPDATE,
                quoteIdentifiers: true})
        }
        else
        {
            delete_dok_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';update t_file set is_active = false, version = :version, modified_date=now(), modified_by=:modified_by where file_id = :file_id returning file_id;", {
                replacements: {file_id: file_id, version: +cek_dok[0].version+1, modified_by:created_by},
                type: model.sequelize1.QueryTypes.UPDATE,
                quoteIdentifiers: true})
        }
    
    return {delete_dok_bp: delete_dok_bp}
}