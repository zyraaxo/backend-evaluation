const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");
require("dotenv").config();

const app = express(); //Used express.js to create a server
const PORT = process.env.PORT || 5001;

app.use(cors());

const parser = new xml2js.Parser({ explicitArray: false });

const fetchAndParseXML = async (url) => {
  try {
    const response = await axios.get(url); //Use axios to fetch data from the url
    return new Promise((resolve, reject) => {
      parser.parseString(response.data, (err, result) => {
        if (err) reject("Error parsing XML");
        resolve(result);
      });
    });
  } catch (error) {
    throw new Error("Failed to fetch XML data");
  }
};

app.get("/", async (req, res) => {
  res.redirect("/api/data"); //did this to load up data instantly on browser for testing purposes
});



app.get("/api/data", async (req, res) => { //used /api/data for the readiblty and allows future expansion by allwing other calls using /api/examplelink
  try {
    const xmlUrl1 = "https://raw.githubusercontent.com/MiddlewareNewZealand/evaluation-instructions/main/xml-api/1.xml";
    const xmlUrl2 = "https://raw.githubusercontent.com/MiddlewareNewZealand/evaluation-instructions/main/xml-api/2.xml";
    
    const xmlData1 = await fetchAndParseXML(xmlUrl1);
    const xmlData2 = await fetchAndParseXML(xmlUrl2);
    
    const mergedData = { data1: xmlData1, data2: xmlData2 }; //Combines both data into one object from above

    res.json(mergedData); //returns it as a json file using  express.js fnctionality
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
