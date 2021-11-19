const express = require('express');
const {google} = require('googleapis'); //named export of 

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index")
});

app.post("/", async (req, res) => {
    const { request, name } = req.body; 


    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
    
   // Create clent instance for auth 
   const clent = await auth.getClient();

   // Instance of Google Sheets api
   const googleSheets = google.sheets({version: "v4", auth:clent});

   const spreadsheetId = "1u9ySSaIoCji7RjJdirrKMkCuK4iov5U2hreraDR7RiI";

   // Get metadata about spreadsheet
   const metadata = await googleSheets.spreadsheets.get({
       auth,
       spreadsheetId
   })

   //Read rows from the spreadsheet
   const getRows = await googleSheets.spreadsheets.values.get({
       auth,
       spreadsheetId,
       range: "Blad1!A:A",
   })

   // Write rows to the spreadsheet
   await googleSheets.spreadsheets.values.append({
       auth,
       spreadsheetId,
       range: "Blad1!A:B",
       valueInputOption: "USER_ENTERED",
       resource: {
         values: [
             [request, name],
         ],
       },
   })

    res.send("successfully submitted! Thank you!");
})

app.listen(1337, (req, res) => console.log("running on 1337"));