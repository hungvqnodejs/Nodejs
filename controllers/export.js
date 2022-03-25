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
    res.setHeader(
        'Content-Disposition', 
        'inline; filename="test2"'
    );



    pdfDoc.pipe(fs.createWriteStream(pdfCovidPath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Hello troller');
    pdfDoc.text('------------------------');

    pdfDoc.text(currentUser.name);
    bodyTemperatureAdmin.forEach(item => {
        pdfDoc.text(`Temperature: ${item.temperature}`);
    })

    vaccineAdmin.forEach(item => {
        pdfDoc.text(`${item.injection} -- ${item.vaccineType}`);
    })

    if(covidAdmin && covidAdmin.length > 0){
        covidAdmin.forEach(item => {
            pdfDoc.text(`${item.injection} -- ${item.vaccineType}`);
        })
    } else {
        pdfDoc.text('Chua co thong tin')
    }
    


    pdfDoc.end();

    // fs.readFile(pdfCovidPath, (err, data) => {
    //   if(err) {
    //     return next(err)
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.send(data)
    // })
};

module.exports = {
  exportFilePdf,
};
