const express = require("express");
const app = express.Router();
const path = require("path");
const Educator = require("../models/ml-educator");
const { Combination, level } = require("../models/ml-academicLevel");
const national = require("../models/ml-national");
const parent = require("../models/ml-parent");
const subject = require("../models/ml-subject");
app.get("/", (req, res) => {
  // console.log(req.body)
  if (!req.body.AdP)
    return res.send(
      "<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.</p>"
    );

  res.sendFile(
    path.dirname(__dirname) + "/public/html/educator/educators.html"
  );
});

app.get("/newEducator", (req, res) => {
  if (!req.body.AdP)
    return res.send(
      "<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.</p>"
    );
  res.sendFile(
    path.dirname(__dirname) + "/public/html/educator/registerEducator.html"
  );
});

/**
 * @Code generator for teacher
 *
 */
const generateEducatorCode = async () => {
  try {
    let generatedId;
    let ID;
    let existingEducator;
    do {
      generatedId = Math.floor(Math.random() * (300 - 100 + 1) + 100);
      ID = "EDU-" + generatedId;
      existingEducator = await Educator.findOne({ code: ID });
    } while (existingEducator);
    return ID;
  } catch (error) {
    console.error("Something went wrong.", error);
  }
};

/**
 * @Register Educator
 */

app.post("/register", async (req, res) => {
  try {
    if (req.body.prefix != "educator" || !req.body.AdP)
      return res.json({
        code: "#NoPrivileges",
        message: "This feature is reserved for admin educators",
      });
    let educatorCode = await generateEducatorCode();
    const newEducator = await new Educator({
      names: req.body.names,
      code: educatorCode,
      title: req.body.title,
      year: req.body.year,
      schoolProgram: req.body.schoolProgram,
      lessons: req.body.lessons,
      email: req.body.email,
      tel: req.body.tel,
      password: "password@123",
    });

    console.log(newEducator.schoolProgram);
    newEducator.schoolProgram.forEach(async (e) => {
      if (e === "National") {
        console.log("here You're ");

        await national.updateOne({}, { $push: { educators: newEducator._id } });
      } else {
        console.log("Program Not Found");
      }
    });
    await newEducator.save();
    res.json({ code: "#SUCCESS", doc: newEducator });
  } catch (error) {
    res.json({ code: "#ERROR", message: error.message });
  }
});

app.get("/view", (req, res) => {
  require("../models/ml-educator").find({}, (err, result) => {
    if (err) return res.json({ code: "#Error", message: err });
    let doc = [];
    for (let { _doc: educator } of result) {
      // console.dir(educator)
      let ed = {};
      Object.keys(educator).map((x) => {
        if (["__v", "password"].includes(x)) return;
        return (ed[x] = educator[x]);
      });
      doc.push(ed);
    }
    res.json({ code: "#Success", doc });
  });
});

app.get("/getOne", (req, res) => {
  require("../models/ml-educator").findOne(
    { _id: req.query.id },
    (err, doc) => {
      if (err) return res.json({ code: "#Error", message: err });
      if (!doc) return res.json({ code: "#NotFound" });
      res.json({ code: "#Success", doc });
    }
  );
});

app.get("/edit", (req, res) => {
  if (!req.body.AdP)
    return res.send(
      "<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.</p>"
    );
  if (!req.query.id) return res.redirect("/educator");
  res.sendFile(
    path.dirname(__dirname) + "/public/html/educator/editEducator.html"
  );
});

app.post("/edit", (req, res) => {
  if (!req.body.AdP) return res.json({ code: "#NoAdminPrivileges" });
  if (!req.query.id) return res.json({ code: "#NoIDProvided" });
  require("../models/ml-educator").updateOne(
    { _id: req.query.id },
    req.body.data,
    (err, doc) => {
      if (err) return res.json({ code: "#Error", message: err });
      res.json({ code: "#Success", doc });
    }
  );
});

app.get("/delete", (req, res) => {
  if (!req.body.AdP) return res.json({ code: "#NoAdminPrivileges" });
  console.log("USER TO DELETE ID ", req.query.id);
  // if (!req.query.id || !mongo.Types.ObjectId.isValid(req.query.id)) {
  //   return res.json({ code: "#InvalidIDProvided" });
  // }

  require("../models/ml-educator").deleteOne({ names: req.query.id }, (err) => {
    if (err) {
      console.error(err);
      return res.json({ code: "#Error", message: err.message });
    }
    res.json({ code: "#Success" });
  });
});

/**
 * ADD Level
 */

app.post("/add_level", async (req, res) => {
  const { year, userCombination } = req.body;
  try {
    console.log(Combination)
    const combinationExist = await Combination.findOne({ name: userCombination});
    console.log(combinationExist)
    if (combinationExist) {
      const newLevel = await level.create({
        year,
        combinations: [userCombination],
      });
      res.json({
        code: "#Success",
        doc: newLevel,
      });
    } else {
      return res.json({
        code: "#Error",
        message: "Combination Doesn't exist",
      });
    }
  } catch (error) {
    console.error("Error creating level:", error);
    return res
      .status(500)
      .json({ code: "#Error", message: "Internal server error" });
  }
});

/**
 * @Generate code
 */

const generateStuddentCode = async () => {
  try {
    let generatedId;
    let ID;
    let existingStudent;
    do {
      generatedId = Math.floor(Math.random() * (5000 - 1000 + 1) + 1000);
      ID = "KDA-" + generatedId;
      existingEducator = await require("../models/ml-student").findOne({
        code: ID,
      });
    } while (existingStudent);
    return ID;
  } catch (error) {
    console.error("Something went wrong.", error);
  }
};

app.post("/student", async (req, res) => {
  try {
    const {
      names,
      level,
      address,
      records,
      email,
      schoolProgram,
      parentName,
      parentNumber,
      parentEmails,
    } = req.body;

    let studentCode = await generateStuddentCode();
    const newStudent = await require("../models/ml-student")({
      names,
      code: studentCode,
      level,
      address,
      records,
      email,
      password: "password@123",
      parentName,
      parentNumber,
      schoolProgram,
      parentEmails,
    });

    await newStudent.save();
    // const newParent = await new parent({
    //   names: newStudent.parentName,
    //   email: newStudent.parentEmails,
    //   tel: newStudent.parentNumber,
    //   password: "password@123",
    //   children: [newStudent.code],
    // });
    // await newParent.save();

    // await national.updateOne({}, { $push: { parents: newParent._id } });

    if (newStudent.schoolProgram === "National") {
      console.log("Program", newStudent.schoolProgram);
      await national.updateOne({}, { $push: { students: newStudent._id } });
      console.log("Check :", national);
    } else {
      console.log("Program Not Recoginezed");
      return;
    }

    res.json({
      code: "#SUCCESS",
      doc: [newStudent],
    });
  } catch (error) {
    res.json({
      code: "#ERROR",
      message: error.message,
    });
    console.log("error :", error);
  }
});

// app.post("/btec", async(req,res)=>{
//   try {
//     // const {term} = req.body
//     const currentTerm = await require('../models/ml-term').findOne({status:true})
//     console.log("TERM :", currentTerm.key)
//     const newBtec = require("../models/ml-btec")({
//       term:currentTerm._id
//     })
//     await newBtec.save()

//   } catch (error) {
//     console.error("THE ERROR :", error.message)
//   }

// })

/**
 * @subject
 */
app.post("/subject", async (req, res) => {
  try {
    const { name } = req.body;
    const title = name.charAt(0).toUpperCase();

    const newSubject = await subject({
      name,
      title,
    });
    await newSubject.save();
    res.json({
      code: "#success",
      doc: newSubject,
    });
    await national.updateOne({}, { $push: { subjects: newSubject._id } });
  } catch (error) {
    res.json({
      code: "#ERROR",
      message: error.message,
    });
  }
});

/**
 * @combination
 * I dont have to create one since once there is any instance concerning studens / educators is created it crated
 */

app.post("/combination", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("combination", name);

    if (name === "MPC" || name === "MCE") {
      const combinationLetters = Array.from(name).map((char) => {
        return char.toUpperCase();
      });
      console.log("combination", combinationLetters);
      const normalSubjects = combinationLetters.filter(
        (letter) => letter !== "C"
      );
      console.log("Other Subjects", normalSubjects);
      const specialSubject = await subject.findOne({
        name: "Computer Science",
      });
      console.log("special Subject", specialSubject);
      const otherSubjects = await subject.find({
        title: {
          $in: [normalSubjects[0], normalSubjects[1], "ENT", "GP"],
        },
      });
      console.log("combination to create :", [specialSubject, otherSubjects]);
      const fullCombination = [
        ...otherSubjects.map((id) => id._id),
        specialSubject._id,
      ];

      const newCombination = await combination.create({
        name,
        subjects: fullCombination,
      });

      console.log("combination created", newCombination);
      await national.updateOne(
        {},
        { $push: { combination: newCombination._id } }
      );

      res.json({
        code: "Success",
        doc: newCombination,
      });
    } else if (
      name === "PCB" ||
      name === "MCB" ||
      name === "BCG" ||
      name === "PCM"
    ) {
      const combinationLetters = Array.from(name).map((char) => {
        return char.toUpperCase();
      });
      console.log("combination", combinationLetters);
      const normalSubjects = combinationLetters.filter(
        (letter) => letter !== "C"
      );
      console.log("Other Subjects", normalSubjects);
      const specialSubject = await subject.findOne({
        name: "Chemistry",
      });
      console.log("special Subject", specialSubject);
      const otherSubjects = await subject.find({
        title: {
          $in: [normalSubjects[0], normalSubjects[1], "ENT", "GP"],
        },
      });
      console.log("Combination to Create", [specialSubject, otherSubjects]);
      const fullCombination = [
        ...otherSubjects.map((id) => id._id),
        specialSubject._id,
      ];

      const newCombination = await combination.create({
        name,
        subjects: fullCombination,
      });

      console.log("combination created", newCombination);
      await national.updateOne(
        {},
        { $push: { combination: newCombination._id } }
      );

      res.json({
        code: "Success",
        doc: newCombination,
      });
    } else {
      const subjects = await subject.find({
        title: {
          $in: [name[0], name[1], name[2], "ENT", "GP"],
        },
      });
      console.log("Combination to be created :", subjects);
      const subjectIds = subjects.map((id) => id._id);

      const newCombination = await combination.create({
        name,
        subjects: subjectIds,
      });

      await national.updateOne(
        {},
        { $push: { combination: newCombination._id } }
      );

      res.json({
        code: "#success",
        doc: newCombination,
      });
    }
  } catch (error) {
    res.json({
      code: "#error",
      message: error.message,
    });
  }
});

/**
 * @Term
 */

app.post("/term", async (req, res) => {
  const { key, start, end, status } = req.body;
  const newTerm = await require("../models/ml-term")({
    key,
    start,
    end,
    status,
  });
  const newNationalTerm = await new national();
  await newNationalTerm.save();
  newTerm.national = newNationalTerm._id;
  await newTerm.save();
  res.json({
    code: "#SUCCESS",
    doc: newTerm,
  });
});
module.exports = app;
