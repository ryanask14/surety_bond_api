var excel = require('excel4node');
var request = require('request-promise');

exports.generateExcel = async function (req, res) {
    // var workbook = new excel.Workbook();

    // var worksheet = workbook.addWorksheet('Sheet 1');
    // var worksheet2 = workbook.addWorksheet('Sheet 2');

    // worksheet.cell(1,1).string('content for display');

    // workbook.write('report.xlsx', res);

    //console.log('generateExcel');

    try {
        let login = await this.jasperLogin();
        let sertifikat = await this.jasperRunReport();
        console.log(login);
        res.end(login.body);
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            status: false,
            message: 'Internal server error'
        })
    }

}

jasperLogin = async function (req, res) {
    try {
        return await request({
            url: 'http://10.10.1.60:8080/jasperserver/rest/login',
            method: 'POST',
            headers: {
                'Authorization': 'Basic amFzcGVyYWRtaW46amFzcGVyYWRtaW4=',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'userLocale=en_US'
            },
            form: {
                'j_username': 'jasperadmin',
                'j_password': 'jasperadmin'
            }
        })
    }
    catch (err) {
        return { error: true, message: err.message }
    }
}

jasperRunReport = async function (req, res) {
    try {
        return await request({
            url: 'http://10.10.1.60:8080/jasperserver/rest_v2/reports/reports/SBODev/LapStatusPengajuan.pdf',
            method: 'GET'
        })
    }
    catch (err) {
        return { error: true, message: err.message }
    }
}