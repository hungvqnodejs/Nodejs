const path = require('path');
const fs = require('fs');
const pdfDoc = require('pdfkit');
const PDFDocument = require('pdfkit');
const User = require("../models/user");
const BodyTemperature = require("../models/bodyTemperature");
const Vaccine = require("../models/vaccine");
const Covid = require("../models/covid");

const exportFilePdf = async (req, res) => {
    const { userId } = req.params;

    const currentUser = await User.findById(userId);
    const bodyTemperatureAdmin = await BodyTemperature.find({userId });
    const covidAdmin = await Covid.find({userId });
    const vaccineAdmin = await Vaccine.find({userId });

    console.log(currentUser)
    console.log(bodyTemperatureAdmin)
    console.log(covidAdmin)
    console.log(vaccineAdmin)


    const pdfCovidPath = path.join('public','assets', 'test.pdf');
 

    const pdfDoc = new PDFDocument();
    res.setHeader('content-type', 'application/pdf' );
    res.setEncoding('utf8');
    res.setHeader(
        'Content-Disposition', 
        'inline; filename="test2"'
    );



    pdfDoc.pipe(fs.createWriteStream(pdfCovidPath));
    pdfDoc.pipe(res); 

    pdfDoc.text(`Nhân viên ${currentUser.name} || Phòng ban ${currentUser.department}`);

    pdfDoc.text('________________________');

    pdfDoc.text('Thông tin thân nhiệt');
    bodyTemperatureAdmin.forEach(item => {
        pdfDoc.text(`- Thân nhiệt: ${item.temperature} độ C`);
    })

    pdfDoc.text('Thông tin Vaccine');
    vaccineAdmin.forEach(item => {
        pdfDoc.text(`- ${item.injection} -- ${item.vaccineType}`);
    })

    pdfDoc.text('Thông tin khai báo Covid');
    if(covidAdmin && covidAdmin.length > 0){
        covidAdmin.forEach(item => {
            pdfDoc.text(`${item.injection} -- ${item.vaccineType}`);
        })
    } else {
        pdfDoc.text('Chưa có thông tin')
    }
    
    pdfDoc.end();
};

module.exports = {
  exportFilePdf,
};
