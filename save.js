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
            x: 320,
            y: 695,
            size: 12
        });
        page.drawText(LTP, {
            x: 320,
            y: 690,
            size: 12
        });
        page.drawText(perChn, {
            x: 320,
            y: 676,
            size: 8
        });
        page.drawText(Volume, {
            x: 320,
            y: 685,
            size: 12
        });
        page.drawText(BuyPrice, {
            x: 320,
            y: 680,
            size: 12
        });
        page.drawText(SellPrice, {
            x: 320,
            y: 675,
            size: 12
        });
        page.drawText(BuyQty, {
            x: 320,
            y: 670,
            size: 12
        });
        page.drawText(SellQty, {
            x: 320,
            y: 665,
            size: 12
        });
        page.drawText(Open, {
            x: 320,
            y: 660,
            size: 12
        });
        page.drawText(PrevClose, {
            x: 320,
            y: 655,
            size: 12
        });

        let finalPDFBytesKaPromise = pdfdoc.save();
        finalPDFBytesKaPromise.then(function(finalPDFBytes){
            fs.writeFileSync(companyPdf, finalPDFBytes);
        })
    })
}