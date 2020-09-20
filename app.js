//jshint esversion: 6
const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
    apiKey: "f85f7e02f8361bd32934c0df11dedbb1-us17",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "us17"
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const listId = "0fa19ed916";

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  async function run() {
      const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
          }
      });

      res.sendFile(__dirname + "/success.html")
    //   console.log(
    // `Successfully added contact as an audience member. The contact's id is ${
    //     response.id
    // }.`
    //);
  }
  //Running the function and catching the errors (if any)
  // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LESSON*************************
  // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
  run().catch(e => res.sendFile(__dirname + "/failure.html"));

//   const jsonData = JSON.stringify(data);
//
//   const url = "https://us17.api.mailchimp.com/3.0/lists/f03e844652";
//   const options = {
//     method: "POST",
//     auth: "m0ntu1:fbdf14b8567fc2378b3ae6b530f21924-us17"
//   };
//   const request = https.request(url, options, function(respons){
//
//     if(respons.statusCode==200){
//       res.sendFile(__dirname + "/success.html");
//     }else{
//       res.sendFile(__dirname + "/failure.html");
//     }
//
//     respons.on("data", function(data){
//       console.log(JSON.parse(data));
//     });
//   });
//   //request.write(jsonData);
//   request.end();

 });

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running on port 3000.");
});

//API key
//f85f7e02f8361bd32934c0df11dedbb1-us17

//List ID
//0fa19ed916
