require('dotenv').config();
//console.log(process.env.API_KEY);
const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https")


const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;
//console.log(typeof(API_KEY));


app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    console.log("Posting");
    const firstName = req.body.fName,
        lastName = req.body.lName,
        email = req.body.email;
    var data = {
        members: [
            {
                email_address: email,
                status: "unsubscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    var jsonData = JSON.stringify(data);
    const URL = "https://us18.api.mailchimp.com/3.0/lists/98c25e68c3"
    const options = {
        method: "POST",
        auth: "Sugam1:" + API_KEY
    }
    console.log(options.auth);
    
    const request = https.request(URL, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            
        })
    })

    request.write(jsonData);
    request.end();
});

app.listen(port, function () {
    console.log("Server up and running at port ", port)

})