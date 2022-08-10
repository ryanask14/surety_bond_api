var model = require('../index');

exports.getAllPKS = async function () {

    all_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp;", {
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {all_pks:all_pks}
}

exports.getPKSById = async function (id_pks) {

    pks_by_id = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name, b.cif_no, d.product_id, d.name as product_name, d.default_rate from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp inner join r_pks_product c on a.id_pks = c.id_pks inner join m_product d on c.product_id = d.product_id  where a.id_pks = :id_pks;", {
        replacements:{id_pks: id_pks},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let json_pks = JSON.parse(pks_by_id[0].json_data);
    pks_by_id[0].cabang = json_pks.branchList

    return {pks_by_id:pks_by_id}
}

exports.lookupPKSACS = async function (limit, offset, body) {

    let lookup_pks
    let data_count

    if(body.tglPks == '')
    {
        if(body.startDate == '' && body.endDate == '')
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%'},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate != '' && body.endDate == '')
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate == '' && body.endDate != '')
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', end_date: body.endDate, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', end_date: body.endDate},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate, end_date: body.endDate, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate, end_date: body.endDate},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
    }
    else
    {
        if(body.startDate == '' && body.endDate == '')
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate != '' && body.endDate == '')
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate == '' && body.endDate != '')
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, end_date: body.endDate, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is not null or PKS.AGREEMENT_DATE = :tgl_pks) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, end_date: body.endDate},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else
        {
            lookup_pks = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION FROM CUSTOMER.CUS_AGREEMENT PKS JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER' ORDER BY PKS.AGREEMENT_ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate, end_date: body.endDate, limit: +limit, offset: limit*(offset-1)},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize2.query("SELECT count(PKS.AGREEMENT_ID) as data_count FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE (UPPER(PKS.AGREEMENT_NO) = :no_pks or UPPER(PKS.AGREEMENT_NO) like :no_pks1 or UPPER(PKS.AGREEMENT_NO) like :no_pks2 or UPPER(PKS.AGREEMENT_NO) like :no_pks3) and (UPPER(BP.NAME) = :name or UPPER(BP.NAME) like :name1 or UPPER(BP.NAME) like :name2 or UPPER(BP.NAME) like :name3) and (PKS.AGREEMENT_DATE is null or PKS.AGREEMENT_DATE = :tgl_pks) and (PKS.START_DATE is null or PKS.START_DATE = :start_date) and (PKS.END_DATE is null or PKS.END_DATE = :end_date) and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate, end_date: body.endDate},
                type: model.sequelize2.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
    }

    return {lookup_pks:lookup_pks, data_count: data_count[0].data_count}
}

exports.getPKSACSById = async function (id_pks) {

    get_pks_acs_by_id = await model.sequelize2.query("SELECT PKS.AGREEMENT_ID AS id_pks, PKS.AGREEMENT_TYPE AS jenis_pks, BP.NAME AS nama_bp, BP.CIF_NO AS cif_no, PKS.AGREEMENT_NO AS no_pks, PKS.PARTY_ID AS bp_id, PKS.AGREEMENT_DATE AS tgl_pks, PKS.START_DATE, PKS.END_DATE, PKS.JSON_DATA AS pks_json_data, PKS.IS_ACTIVE AS is_active, PKS.VERSION, PKS_PRODUK.PRODUCT_ID AS product_id, PKS_PRODUK.JSON_DATA AS pks_produk_json_data FROM CUSTOMER.CUS_AGREEMENT PKS INNER JOIN CUSTOMER.CUS_AGREEMENT_PRODUCT PKS_PRODUK ON PKS.AGREEMENT_ID = PKS_PRODUK.AGREEMENT_ID INNER JOIN CUSTOMER.CUS_BP BP on BP.BP_ID = PKS.PARTY_ID WHERE PKS.AGREEMENT_ID = :id_pks and PKS.AGREEMENT_TYPE = 'AGREEMENT_TYPE.PKS_AGEN_BROKER';", {
        replacements:{id_pks: id_pks.trim()},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})

    let cabang = JSON.parse(get_pks_acs_by_id[0].pks_json_data)
    let product = []
    let product_json = []
    
    for(let i = 0; i<get_pks_acs_by_id.length; i++)
    {
        get_pks_acs_by_id[i].cabang = cabang.branchList
    }
    for(let i = 0; i<get_pks_acs_by_id.length; i++)
    {
        product.push(get_pks_acs_by_id[i].product_id)
        product_json.push(get_pks_acs_by_id[i].pks_produk_json_data)
    }

    get_product_by_id = await model.sequelize1.query("select * from m_product where product_id in(:product_id) and is_active = true;", {
        replacements:{product_id: product},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})

    return {get_pks_acs_by_id:get_pks_acs_by_id, list_product_system:get_product_by_id, list_json_product: product_json}
}

exports.searchPKS = async function (limit, offset, body) {

    let search_pks
    let data_count
    if(body.tglPks == '')
    {
        if(body.startDate == '' && body.endDate == '')
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%'},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate != '' && body.endDate == '')
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.start_date is null or a.start_date = :start_date) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.start_date is null or a.start_date = :start_date)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate == '' && body.endDate != '')
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.end_date is null or a.end_date = :end_date) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', end_date: body.endDate, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.end_date is null or a.end_date = :end_date)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', end_date: body.endDate},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.start_date is null or a.start_date = :start_date) and (a.end_date is null or a.end_date = :end_date) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate, end_date: body.endDate, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.start_date is null or a.start_date = :start_date) and (a.end_date is null or a.end_date = :end_date)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', start_date: body.startDate, end_date: body.endDate},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
    }
    else
    {
        if(body.startDate == '' && body.endDate == '')
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate != '' && body.endDate == '')
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) and (a.start_date is null or a.start_date = :start_date) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) and (a.start_date is null or a.start_date = :start_date)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else if(body.startDate == '' && body.endDate != '')
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) and (a.end_date is null or a.end_date = :end_date) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, end_date: body.endDate, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) and (a.end_date is null or a.end_date = :end_date)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, end_date: body.endDate},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
        else
        {
            search_pks = await model.sequelize1.query("select a.id_pks, a.id_bp, a.jenis_pks, a.no_pks, a.tgl_pks, a.start_date, a.end_date, a.json_data, a.is_active, b.name from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) and (a.start_date is null or a.start_date = :start_date) and (a.end_date is null or a.end_date = :end_date) limit :limit offset :offset;", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate, end_date: body.endDate, limit: limit, offset: limit*(offset-1)},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        
            data_count = await model.sequelize1.query("select count(a.id_pks) as data_count from m_pks a inner join m_bussiness_partner b on a.id_bp = b.id_bp where (UPPER(a.no_pks) = :no_pks or UPPER(a.no_pks) like :no_pks1 or UPPER(a.no_pks) like :no_pks2 or UPPER(a.no_pks) like :no_pks3) and (UPPER(b.name) = :name or UPPER(b.name) like :name1 or UPPER(b.name) like :name2 or UPPER(b.name) like :name3) and (a.tgl_pks is null or a.tgl_pks = :tgl_pks) and (a.start_date is null or a.start_date = :start_date) and (a.end_date is null or a.end_date = :end_date)", {
                replacements:{no_pks: body.noPks.toUpperCase(), no_pks1: '%'+body.noPks.toUpperCase(), no_pks2: '%'+body.noPks.toUpperCase()+'%', no_pks3: body.noPks.toUpperCase()+'%', name: body.name.toUpperCase(), name1: '%'+body.name.toUpperCase(), name2: '%'+body.name.toUpperCase()+'%', name3: body.name.toUpperCase()+'%', tgl_pks: body.tglPks, start_date: body.startDate, end_date: body.endDate},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
    }

    return {search_pks:search_pks, data_count: data_count[0].data_count}
}

exports.syncPKS = async function (body, created_by) {
    var insert_pks
    bp_by_id = await model.sequelize1.query("select * from m_bussiness_partner where id_bp = :id_bp;", {
        replacements:{id_bp: body.idBp.toLowerCase().trim()},
        type: model.sequelize1.QueryTypes.SELECT,
        quoteIdentifiers: true})
    get_bp_acs_by_id = await model.sequelize2.query("SELECT BP.BP_ID as id_bp, BP.CIF_NO as cif_no, BP.PARTNER_TYPE_ID as partner_type_id, BP.NAME as name, BP_ADD.ADDRESS as address, BP_ADD.ZIP_CODE as zip_code , BP.NPWP as npwp, BP.ID_NO as id_no, BP.IS_ACTIVE as is_active, BP.VERSION as version FROM CUSTOMER.CUS_BP BP INNER JOIN CUSTOMER.CUS_BP_ADDRESS BP_ADD ON BP.BP_ID = BP_ADD.BP_ID AND BP_ADD.IS_PRIMARY = '1' WHERE BP.BP_ID = :bp_id", {
        replacements: {bp_id: body.idBp},
        type: model.sequelize2.QueryTypes.SELECT,
        quoteIdentifiers: true})

    if(!bp_by_id.length)
    {
        if(get_bp_acs_by_id.length)
        {
            insert_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_bussiness_partner(id_bp, cif_no, partner_type_id, name, address, zipcode, npwp, id_no, is_active, version, created_by, created_date)VALUES(:id_bp, :cif_no, :partner_type_id, :name, :address, :zip_code, :npwp, :id_no, :is_active, :version, :created_by, now()) returning id_bp, cif_no, partner_type_id, name, address, zipcode, npwp, id_no;", {
                replacements: {id_bp: get_bp_acs_by_id[0].id_bp.toLowerCase().trim(), cif_no: get_bp_acs_by_id[0].cif_no, partner_type_id: get_bp_acs_by_id[0].partner_type_id, name: get_bp_acs_by_id[0].name, address: get_bp_acs_by_id[0].address, zip_code: get_bp_acs_by_id[0].zip_code, npwp: get_bp_acs_by_id[0].npwp.replace(/[^0-9a-z]/gi, ""), id_no: get_bp_acs_by_id[0].id_no, is_active: get_bp_acs_by_id[0].is_active, version: get_bp_acs_by_id[0].version, created_by: created_by},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true})

                return{sync_pks: false}
        }
    }
    else
    {
        if(get_bp_acs_by_id[0].version > bp_by_id[0].version)
        {
            update_bp = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';UPDATE public.m_bussiness_partner set cif_no = :cif_no, partner_type_id = :partner_type_id, name = :name, address = :address, zipcode = :zip_code, npwp = :npwp, id_no = :id_no, is_active = :is_active, version = :version, modified_by = :modified_by, modified_date = now() where id_bp = :id_bp returning id_bp, cif_no, partner_type_id, name, address, zipcode, npwp, id_no;", {
                replacements: {id_bp: get_bp_acs_by_id[0].id_bp.toLowerCase().trim(), cif_no: get_bp_acs_by_id[0].cif_no, partner_type_id: get_bp_acs_by_id[0].partner_type_id, name: get_bp_acs_by_id[0].name, address: get_bp_acs_by_id[0].address, zip_code: get_bp_acs_by_id[0].zip_code, npwp: get_bp_acs_by_id[0].npwp.replace(/[^0-9a-z]/gi, ""), id_no: get_bp_acs_by_id[0].id_no, is_active: get_bp_acs_by_id[0].is_active, version: get_bp_acs_by_id[0].version, created_by: created_by},
                type: model.sequelize1.QueryTypes.UPDATE,
                quoteIdentifiers: true})
        }
        pks_by_id = await model.sequelize1.query("select * from m_pks where id_pks = :id_pks;", {
            replacements:{id_pks: body.idPks},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
    
        if(!pks_by_id.length)
        {
            insert_pks = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.m_pks(id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active, version, created_by, created_date)VALUES(:id_pks, :id_bp, :jenis_pks, :no_pks, :tgl_pks, :start_date, :end_date, :json_data, :is_active, :version, :created_by, now());", {
                replacements: {id_pks: body.idPks.toLowerCase().trim(), id_bp: body.idBp.toLowerCase().trim(), jenis_pks: body.jenisPks, no_pks: body.noPks, tgl_pks: body.tglPks, start_date: body.startDate, end_date: body.endDate, json_data: body.pksJsonData, is_active: body.isActive, version: body.version, created_by: created_by},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true})
        }
        else
        {
            if(pks_by_id[0].version < body.version)
            {
                insert_pks = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';UPDATE public.m_pks SET id_bp=:id_bp, jenis_pks=:jenis_pks, no_pks=:no_pks, tgl_pks=:tgl_pks, start_date=:start_date, end_date=:end_date, json_data=:json_data, is_active=:is_active, version=:version, modified_by=:created_by, modified_date=now() WHERE id_pks=:id_pks returning id_pks, id_bp, jenis_pks, no_pks, tgl_pks, start_date, end_date, json_data, is_active;", {
                    replacements: {id_pks: body.idPks.toLowerCase().trim(), id_bp: body.idBp.toLowerCase().trim(), jenis_pks: body.jenisPks, no_pks: body.noPks, tgl_pks: body.tglPks, start_date: body.startDate, end_date: body.endDate, json_data: body.pksJsonData, is_active: body.isActive, version: body.version, created_by: created_by},
                    type: model.sequelize1.QueryTypes.UPDATE,
                    quoteIdentifiers: true})   
            }
            else
            {
                return {sync_pks: true}    
            }
        }
    
        get_r_pks_product_not_include = await model.sequelize1.query("select * from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
            replacements: {id_pks: body.idPks.toLowerCase().trim(), product_id : body.productId},
            type: model.sequelize1.QueryTypes.SELECT,
            quoteIdentifiers: true})
        if(get_r_pks_product_not_include.length)
        {
            await model.sequelize1.query("delete from r_pks_product where product_id not in(:product_id) and id_pks = :id_pks;", {
                replacements: {id_pks: body.idPks.toLowerCase().trim(), product_id : body.productId},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
        }
    
        for(let i = 0; i < body.productId.length; i++)
        {
            get_r_pks_product = await model.sequelize1.query("select * from r_pks_product where product_id = :product_id and id_pks = :id_pks", {
                replacements: {id_pks: body.idPks.toLowerCase().trim(), product_id: body.productId[i]},
                type: model.sequelize1.QueryTypes.SELECT,
                quoteIdentifiers: true})
            if(!get_r_pks_product.length)
            insert_r_pks_product = await model.sequelize1.query("SET TIMEZONE='Asia/Bangkok';INSERT INTO public.r_pks_product(id_pks, product_id, json_data)VALUES(:id_pks, :product_id, :json_data);", {
                replacements: {id_pks: body.idPks.toLowerCase().trim(), json_data: body.pksProdukJsonData[i], product_id: body.productId[i]},
                type: model.sequelize1.QueryTypes.INSERT,
                quoteIdentifiers: true})
        }
    
        return {sync_pks: insert_pks}
    }
}