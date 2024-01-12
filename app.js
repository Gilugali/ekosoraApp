const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongo = require("mongoose");
const axios = require("axios");
const studentRoute = require("./routes/students");
const getInRoute = require("./routes/getIn");
const parentRoute = require("./routes/parents");
const educatorRoute = require("./routes/educators");
const Educator = require("./models/ml-educator")
const announcementRoute = require("./routes/announcements");
const settingsRoute = require("./routes/settings");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const eUpload = require("express-fileupload");
// const fetch = require('node-fetch')

//middleware
require("dotenv").config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(eUpload());
app.use(express.static("public"));


app.use((req, res, next) => {
  /* 

  * Here I check that the request is among the requests that require having a cookie 
  * And if the cookie is absent, then the request is denied or redirected to the login page  
  
  */
  if (req.originalUrl.match(/login/)) return next();
  if (req.method != "GET") {
    if (req.path.match("/parent")) return next();
    if (req.cookies.jwt == undefined) {
      console.log("No jwt token");
      return res.json({ code: "#NoTokenNoService" });
    } else {
      jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result) => {
        if (err) return res.json({ code: "#InvalidToekn" });
      });
    }
  }
  if (req.originalUrl != "/") {
    if (req.path.match("/parent")) return next();
    if (!req.originalUrl.match(/login/)) {
      // console.log(req.path)
      if (req.cookies.jwt == undefined) {
        console.log("No jwt token");
        if (req.path == "/favicon.ico")
          return res.sendFile(__dirname + "/public/img/favicon.png");
        if (!["/logout", "/favicon"].includes(req.path)) {
          res.cookie("redirected", "true", {
            maxAge: 5 * 60 * 1000,
          });
          res.cookie("from", req.path.toString(), {
            maxAge: 5 * 60 * 1000,
          });
        }
        return res.redirect("/login");
      } else {
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result) => {
          if (err) return res.redirect("/login");
          // console.log(result)
          req.body.prefix = result.AT;
          req.body.AdP = result.AdP;
        });
      }
    }
  }

  next();
});

app.use("/announcement", announcementRoute);
app.use("/settings", settingsRoute);
app.use("/student", studentRoute);
app.use("/educator", educatorRoute);
app.use("/parent", parentRoute);
app.use("/getin", getInRoute);
require("dotenv").config();

//Connecting to the DB
let CONN_STR = process.env.DB_CONN_STR;

mongo.connect(CONN_STR, (err) => {
  if (err) return console.log("Something went wrong.", err);
  console.log("#ConnectedToDB");
});




app.get("/", (req, res) => {
  res.sendFile(__dirname + `/public/html/index.html`);
});
app.get("/login", (req, res) => {
  res.redirect("/getin/login");
});

app.get("/logout", (req, res) => {
  console.log("Logging out");
  res.redirect("/getin/logout");
});
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + `/public/html/${req.body.prefix}/dashboard.html`);
});
app.get("/course", (req, res) => {
  res.sendFile(__dirname + `/public/html/${req.body.prefix}/course.html`);
});
app.get("/programs", (req,res)=>{
  res.sendFile(__dirname + `/public/html/${req.body.prefix}/programs.html`);
})
app.get("/newEducator", (req, res) => {
  console.log("title is ", req.body.prefix)
   if(req.body.prefix === "educator"){
      res.sendFile(__dirname + `/public/html/${req.body.prefix}/registerEducator.html`)
   }
})
app.get("/newStudent", (req, res) => {
  console.log("title is ", req.body.prefix)
   if(req.body.prefix === "educator"){
      res.sendFile(__dirname + `/public/html/${req.body.prefix}/registerStudent.html`)
   }
})
app.get('/academic', (req,res)=>{
  if(req.body.prefix === "educator"){
    res.sendFile(__dirname + `/public/html/${req.body.prefix}/academic.html`)

  }
})

app.get("/marks", (req, res) => {
  req.body.dir = req.body.prefix;
  req.body.prefix = ["student", "parent"].includes(req.body.prefix) ? "" : "edit";
  console.log(`Sending ${req.body.prefix}Marks.html`);
  res.sendFile(__dirname + `/public/html/${req.body.dir}/${req.body.prefix}Marks.html`
  );
});
app.get('/btec/marks', (req,res)=>{''
    
  req.body.dir= req.body.prefix
  req.body.prefix =  ["student", "parent"] ? "": "edit";
  res.sendFile(__dirname + `/public/html/${req.body.dir}/${req.body.prefix}Marks.html`);

})


app.get("/subjects", (req, res) => {
  require("./models/ml-subject").find({}, (err, doc) => {
    if (err) return res.json({ code: "#Error" });
    res.json({ code: "#Success", doc });
  });
});
const { Course,level } = require('./models/ml-academicLevel')
app.get('/academicLevel', async(req,res)=>{
  // console.log("hello Academic Level")
  try {

    const levels = await level.find({}).populate('combinations')
    // console.log(levels)
    res.json({
      code:'#Success',
      message:'Populated successfully',
      doc:levels

    })
  } catch (error) {
    res.json({
      code:'#Error',
      message:error.message
    })
  }


})
app.get("/settings", (req, res) => {
  res.sendFile(__dirname + `/public/html/${req.body.prefix}/settings.html`);
});


app.get("/getInfo", getUserId, (req, res) => {
  // console.log(req.body)
  require(`./models/ml-${req.body.prefix}`).findOne(
    { _id: req.body.userId },
    (err, doc) => {
      if (err) return res.json({ code: "#Error", message: err });
      if (doc == null) return res.json({ code: "#NoSuchID" });
      let toSend = { ...doc._doc, accountType: req.body.prefix };
      res.json({ code: "#Success", doc: toSend });
    }
  );
});

// const school = require('./models/ml-school')
app.post("/school", async(req,res)=>{
  try {
    const {name, code, moto, location , headMaster, schoolEmail, schoolPrograms, schoolPhoneNumber} = req.body

    const newSchool = await require('./models/ml-school')({
      name,
      code,
      moto,
      location,
      headMaster,
      schoolEmail,
      schoolPrograms,
      schoolPhoneNumber,
    })
   await newSchool.save()
    res.json({code:'#SUCESS', doc:newSchool})
  } catch (error) {
    res.json({
      code:"#ERROR",
      message:"ERROR HAPPENED",
      error
    })
  }
 
})

app.get("/timetable", (req, res) => {
  res.send(
    "<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>Page still under construction. <a href='/dashboard'>Click here</a> to go back</p>"
  );
});

app.get("*", (req, res) => {
  res.send(
    "<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>Page not found. <a href='/dashboard'>Click here</a> to go back</p>"
  );
});

app.post('/olevel',async(req,res)=>{
  const {subjects}= req.body
  const newSubject = await require("./models/ml-olevel")({
    subjects,
  })
  await newSubject.save()
  res.json({
    code:"#SUCCESS",
    doc:newSubject
  })
})


/**
 * @LOCATION API
 * @VERSION 2.4
 */

// Inside the backend route or controller
app.get('/api/data', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://rwanda.p.rapidapi.com/',
    headers: {
      'X-RapidAPI-Key': 'aa05dbd9c9msh658d6092df6f539p157172jsn1033aa8facca',
      'X-RapidAPI-Host': 'rwanda.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data); // Sending the data as JSON to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(process.env.PORT, (err) => {
  if (err) return console.log("Something went wrong!");
  console.log("#ServerUP at " + process.env.PORT);
});
app.post('/admin', (req,res)=>{

})

function getUserId(req, res, next) {
  jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result) => {
    if (err) return res.json({ code: "#InvalidToken" });
    req.body.userId = result.userId;
    next();
    // console.log(result)
  });
}

