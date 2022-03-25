const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const User = require("../models/user");
const BodyTemperature = require("../models/bodyTemperature");
const Vaccine = require("../models/vaccine");
const Covid = require("../models/covid");



const exportFilePdf = async (req, res) => {


    
function bodauTV(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    // str = str.replace(/\s/g, '-');
    return str;
}

    const { userId } = req.params;

    const currentUser = await User.findById(userId);
    const bodyTemperatureAdmin = await BodyTemperature.find({userId });
    const covidAdmin = await Covid.find({userId });
    const vaccineAdmin = await Vaccine.find({userId });
    console.log(covidAdmin)
 


    const pdfCovidPath = path.join('public','assets', 'covid.pdf');
 

    const pdfDoc = new PDFDocument();
    res.setHeader('content-type', 'application/pdf' );
    res.setHeader("accept-charset", "UTF-8");
    res.setHeader(
        'Content-Disposition', 
        'inline; filename="covid"'
    );

    pdfDoc.pipe(fs.createWriteStream(pdfCovidPath));
    pdfDoc.pipe(res); 

    pdfDoc.text(`Nhân viên ${currentUser.name} || Phong ban ${currentUser.department}`);

    pdfDoc.text('________________________');

    pdfDoc.text('Thông tin thân nhiêt');
    bodyTemperatureAdmin.forEach(item => {
        pdfDoc.text(`- Thân nhiêt: ${item.temperature} do C`);
    })

    pdfDoc.text('Thông tin Vaccine');
    vaccineAdmin.forEach(item => {
        pdfDoc.text(`- ${bodauTV(item.injection)} ${item.vaccineType}`);
    })

    pdfDoc.text('Thông tin khai bao Covid');
    if(covidAdmin && covidAdmin.length > 0){
        covidAdmin.forEach(item => {
            pdfDoc.text(`${item.injection} -- ${item.vaccineType}`);
        })
    } else {
        pdfDoc.text('- Chua co thông tin')
    }
    
    pdfDoc.end();
};

module.exports = {
  exportFilePdf,
};
