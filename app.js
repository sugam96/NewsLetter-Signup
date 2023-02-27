require('dotenv').config();
//console.log(process.env.API_KEY);
const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https")


const app = express();
const port = process.env.PORT;
const API_KEY = process.env.API_KEY;


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
    //console.log(options.auth);

    const request = https.request(URL, options, function (response) {
        response.on("data", function (data) {
            //console.log(JSON.parse(data));
            if (response.statusCode === 200) {
                //res.send("Successfully Subscribed!");
                res.sendFile(__dirname + "/success.html")
                console.log("Success");
            }
            else {
                //res.send("Something Went Wrong, Please Try Again!");
                res.sendFile(__dirname + "/failure.html")
                console.log("Failure");
            }
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    //console.log("Redirecting");
    res.sendFile(__dirname + "/signup.html");
});

//Works for both Heroku and localhost 3000
app.listen(port || 3000, function () {
    console.log("Server up and running at port ", port)
});