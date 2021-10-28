// This project returns the share transaction of a perticular day of each company under NIFTY50 and 
// the data has been fetchef from moneycontrol.com which is a trustable website for many investors.
URL = 'https://www.moneycontrol.com/markets/indian-indices/';
const request = require ('postman-request');
const cheerio = require('cheerio');
const fs = require ('fs');
const excel = require ('excel4node');
const pdfLib = require ('pdf-lib');
const path = require ('path');
// const { createPDFAcroFields } = require('pdf-lib');


request(URL , (error,response , html)=> {
    if(error){
        console.log(error);
    }else{
        HTMLextracter(html);
    }
})

function HTMLextracter(html){
    const $ = cheerio.load(html);
    const tablepart = $('#MT_indiright_tbl');

    let companyArr = [];
    let companies = $('#indicesTableData tbody tr');
    for(let i = 0 ; i < companies.length ; i++){
        let oneCompanyKaObjData = {

        };
        let onecompanykaData = $(companies[i]).find('td');
        oneCompanyKaObjData.Name =$(onecompanykaData[0]).text();
        oneCompanyKaObjData.LTP = $(onecompanykaData[1]).text();
        oneCompanyKaObjData.perChn =  $(onecompanykaData[2]).text();
        oneCompanyKaObjData.Volume =  $(onecompanykaData[3]).text();
        oneCompanyKaObjData.BuyPrice = $(onecompanykaData[4]).text();
        oneCompanyKaObjData.SellPrice =  $(onecompanykaData[5]).text();
        oneCompanyKaObjData.BuyQty =  $(onecompanykaData[6]).text();
        oneCompanyKaObjData.SellQty = $(onecompanykaData[7]).text();
        oneCompanyKaObjData.Open =  $(onecompanykaData[8]).text();
        oneCompanyKaObjData.PrevClose = $(onecompanykaData[9]).text();

        companyArr.push(oneCompanyKaObjData);
    }
}

let companyJSON = fs.readFileSync("result.json" , "utf-8");
let companiesName = JSON.parse(companyJSON);


// excel work begins here

// excel designing
let wb = new excel.Workbook();
var myStyle = wb.createStyle({
    font: {
      bold: true,
      color: '#A30000',
    },
  });

  var myStyle2 = wb.createStyle({
    font: {
      bold: true,
      color:'#01949A'
    },
  });

  var mystyle3 = wb.createStyle({
      font:{
          bold : true,
          color : '#DB1F48'
      },
  })


// excel data loading
for(let i = 0 ;i < companiesName.length ; i++){
    let sheet = wb.addWorksheet(companiesName[i].Name);

    sheet.addConditionalFormattingRule('A1:A10', {
        // apply ws formatting ref 'A1:A10'
        type: 'expression', // the conditional formatting type
        priority: 1, // rule priority order (required)
        formula: 'NOT(ISERROR(SEARCH("NIFTY 50", A1)))', // formula that returns nonzero or 0
        style: myStyle, // a style object containing styles to apply
    });

    sheet.cell(1,1).string("NIFTY 50");
    
    sheet.cell(3,1).string("Company Name").style(myStyle2);
    sheet.cell(3,3).string(companiesName[i].Name).style(mystyle3);
    sheet.cell(4,1).string("LTP").style(myStyle2);
    sheet.cell(4,3).string(companiesName[i].LTP);
    sheet.cell(5,1).string("%Change").style(myStyle2);
    sheet.cell(5,3).string(companiesName[i].perChn);
    sheet.cell(6,1).string("Volume").style(myStyle2);
    sheet.cell(6,3).string(companiesName[i].Volume);
    sheet.cell(7,1).string("Buy Price").style(myStyle2);
    sheet.cell(7,3).string(companiesName[i].BuyPrice);
    sheet.cell(8,1).string("Sell Price").style(myStyle2);
    sheet.cell(8,3).string(companiesName[i].SellPrice);
    sheet.cell(9,1).string("Buy Quantity").style(myStyle2);
    sheet.cell(9,3).string(companiesName[i].BuyQty);
    sheet.cell(10,1).string("Sell Quantity").style(myStyle2);
    sheet.cell(10,3).string(companiesName[i].SellQty);
    sheet.cell(11,1).string("Open Today").style(myStyle2);
    sheet.cell(11,3).string(companiesName[i].Open);
    sheet.cell(12,1).string("Previous Close").style(myStyle2);
    sheet.cell(12,3).string(companiesName[i].PrevClose);
    
}
wb.write("company.xlsx");

// excel work ends here


// pdf work begins here


// apne pehle chahiye ek folder -|-->  sari pdfs --> jo ki company k naam.pdf se save ho

fs.mkdirSync("pdf-Files");


for(let i = 0 ; i < companiesName.length ; i++){

    let companyKnaamKaPDF = companiesName[i].Name + ".pdf";
    let companyPDFfile = path.join("pdf-Files" , companyKnaamKaPDF);
    createPDFs(companiesName[i] , companyPDFfile);
}


function createPDFs(companyArr , companyPdf){
    let Name = companyArr.Name;
    let LTP = companyArr.LTP;
    let perChn = companyArr.perChn;
    let Volume = companyArr.Volume;
    let BuyPrice = companyArr.BuyPrice;
    let SellPrice = companyArr.SellPrice;
    let BuyQty = companyArr.BuyQty;
    let SellQty = companyArr.SellQty;
    let Open = companyArr.Open;
    let PrevClose = companyArr.PrevClose;

    // console.log(Name +" " + LTP +" " + perChn +" " + Volume +" " + BuyPrice +SellPrice+ " "+ BuyQty + " "+ SellQty+ " "+ Open+ " "+ PrevClose);


    let bytesOfPDFTemplate = fs.readFileSync("template.pdf");
    let pdfdocKaPromise = pdfLib.PDFDocument.load(bytesOfPDFTemplate);

    pdfdocKaPromise.then(function(pdfdoc){
        let page = pdfdoc.getPage(0);

        page.drawText(Name, {
            x: 340,
            y: 680,
            size: 15
        });
        page.drawText(LTP, {
            x: 340,
            y: 660,
            size: 15
        });
        page.drawText(perChn, {
            x: 340,
            y: 640,
            size: 15
        });
        page.drawText(Volume, {
            x: 340,
            y: 620,
            size: 15
        });
        page.drawText(BuyPrice, {
            x: 340,
            y: 600,
            size: 15
        });
        page.drawText(SellPrice, {
            x: 340,
            y: 580,
            size: 15
        });
        page.drawText(BuyQty, {
            x: 340,
            y: 560,
            size: 15
        });
        page.drawText(SellQty, {
            x: 340,
            y: 540,
            size: 15
        });
        page.drawText(Open, {
            x: 340,
            y: 520,
            size: 15
        });
        page.drawText(PrevClose, {
            x: 340,
            y: 500,
            size: 15
        });

        let finalPDFBytesKaPromise = pdfdoc.save();
        finalPDFBytesKaPromise.then(function(finalPDFBytes){
            fs.writeFileSync(companyPdf, finalPDFBytes);
        })
    })
}
