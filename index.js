const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());



app.use(express.json());

const gstPaid= {
    "GSTTotal": {
       "AssessmentYear": {
         "year":"2019",
           "monthlyGST":{
             "jan":30000,
             "feb":28500,
             "mar":32100,
             "apr":29724,
             "may":31200,
             "jun":32100,
             "jul":30100,
             "aug":30200,
             "sep":30300,
             "oct":30400,
             "nov":30500,
             "dec":30900
           }
       }
     }
}



const itr3 = {
    "ITR3": {
       "AssessmentYear": "2019",
       "AssessmentDate": "2020-05-04",
       "CreationInfo": {
          "SWVersionNo": "R5",
          "SWCreatedBy": "SK12345678",
          "XMLCreatedBy": "SK12345678",
          "XMLCreationDate": "2018-06-15",
          "IntermediaryCity": "CHENNAI",
          "Digest": "A2n72D0m5WomyXppYOBGqHRkZ9PDZi88p0L1XACBi9s="
       },
       "PersonalInfo": {
          "AssesseeName": {
             "FirstName": "KIRAN",
             "SurNameOrOrgName": "SELVAN"
          },
          "PAN": "ACMEN12345",
          "Address": {
             "ResidenceNo": "HNO 3-5-118/6/2,THIRD FLR",
             "RoadOrStreet": "THIRD FLR,KRISHNA NAGAR ,GANDHI NGR CLNY",
             "LocalityOrArea": "CHROMEPET",
             "CityOrTownOrDistrict": "CHENNAI",
             "StateCode": "33",
             "CountryCode": "91",
             "PinCode": "600058",
             "CountryCodeMobile": "91",
             "MobileNo": "9884518410",
             "EmailAddress": "krisat3003@gmail.com",
             "EmailAddressSec": "finance21consulting@gmail.com"
          },
          "DOB": "1981-07-11",
          "AadhaarCardNo": "50350882045"
       },
       "AuditInfo": {
          "AuditReportFurnishDate": "2018-06-04",
          "AuditorName": "CA SUNDAR K",
          "AuditorMemNo": "023835",
          "AudFrmName": "CA SUNDAR K",
          "AudFrmRegNo": "00012345",
          "AudFrmPAN": "SKBNC54321",
          "AuditDate": "2018-06-04"
       },
       "NatOfBus": {
          "NatureOfBusiness": {
             "Code": "04045",
             "TradeName1": "ACME Nutraceuticals"
          }
       },
       "SummaryFinancials": {
          "BalanceSheet": {
             "StockInTrade": "200000",
             "Recievables": "400000",
             "CashAndBankBalance": "100000",
             "Payables": "200000"
          },
          "ProfitAndLoss": {
             "GrossSales": "2000000",
             "Purchases": "1200000",
             "OtherDirectCosts": "0",
             "GrossProfit": "800000",
             "Expenses": null,
             "NetProfit": null
          }
       }
    }
 };

let billOfLading = {
    "isValid": true,
	"negotiable": false,
	"billOfLadingNumber": "TestBoL1002CFS",
	"consignor": {
		"name": "Testconsignor1",
		"printedParty": "Test Consignor Printed Party1 STREET ADDRESS City,03039"
	},
	"consignee": {
		"name": "Testconsignee1",
		"registeredForVAT": false
	},
	"notifyParties": [{
		"name": "TestNotifyParty1",
		"registeredForVAT": false
	}],
	"otherParties": [{
		"name": "TestOtherPartyName1",
		"registeredForVAT": false
	}],
	"declarationofInterest": false,
	"particulars": [{
		"grossWeight": {
			"unit": "KG",
			"oceanCarrierCode": "TSTC",
			"freightedAtAd": false
		}
	}]
};

app.post('/verify/billOfLading', (req, res) => {

  console.log('processing BL verification.. Reference implementation based on the TRADELENS developer portal references ');

    console.log(req.body);
    billOfLading.billOfLadingNumber = req.body.billOfLadingNumber;
    billOfLading.oceanCarrierCode = req.body.oceanCarrierCode;
    billOfLading.consignor.printedParty = req.body.consignorPrintedParty;
    res.send(billOfLading);

})


app.get('/', function (req, res) {
  res.render('index', {});
})


app.get('/hello', (req, res) => {
    console.log(req.body);

    res.send('hello from server');

})

app.post('/monthlyAvgGSTInTier', (req, res) => {
    console.log(req.body);

    const avg=30300;
    const queryTiers = req.body.queryTiers;
    const response = {
      "name":"",
      "result":"0"
     }


    for (var i = 0; i < queryTiers.length; i++) {

      if(queryTiers[i].operator == "LESSTHAN"){
          if(avg <= +queryTiers[i].value){
            response.name=queryTiers[i].name;
            response.result="1";
            break;
          }

      }

      if(queryTiers[i].operator == "GREATERTHAN"){
          if(avg > +queryTiers[i].value){
            response.name=queryTiers[i].name;
            response.result="1";
            break;
          }

      }

         if(queryTiers[i].operator ==  "BETWEEN"){
           const limit = queryTiers[i].value.split("-");

           console.log(limit , avg ,  avg > parseInt(limit[0]) , avg < parseInt(limit[1])  );

           if( avg > parseInt(limit[0])  && avg < parseInt(limit[1]) ){

             console.log(" inner ", limit);
             response.name=queryTiers[i].name;
             response.result="1";
             break;
           }
         }

      }

    res.send(response);
})

/*
app.get('/fetchIncomeTaxReturns', (req, res) => {
    console.log(req.body);

    res.send(itr3);

})
*/

/*

Bill of Lading number: TestBoL1002CFS
Ocean carrier code (SCAC code): TSTC
Consignor printed party: Test Consignor Printed Party1 STREET ADDRESS City, 03039, Country


*/
app.get('/fetchIncomeTaxReturns/fromDate/:fromDate/toDate/:toDate/pan/:pan', (req, res) => {

   console.log('fetching IncomeTax Returns .. Simple reference implementation based on the ITR3 spec');
   console.log(req.body);
   console.log(res.body);

   res.send(itr3);

})

app.get('risk', (req, res) => {

   var risk = 100

   const lastYearAudited = itr3.AssessmentYear
   risk = lastYearAudited ? risk - 30 : risk - 10;

   const loanAmount = req.query.loanAmount
   const grossSales = itr3.SummaryFinancials.ProfitAndLoss.GrossSales
   const grossSalesToLoanAmount_ratio = grossSales / loanAmount
   const ratioIsGreaterThan4 = grossSalesToLoanAmount_ratio > 4


   res.send();

})


app.get('/uint256', (req, res) => {
   res.send({"uint256":183});
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
