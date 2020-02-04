const express = require("express");
const router = express.Router();
const Profile = require("../model/profile");
const Exp = require("../model/experience");
const json2csv = require("json2csv").parse;
const path = require("path");
const multer = require("multer");
const { writeFile } = require("fs-extra");

router.get("/", async (req, res) => {
  try {
    const exps = await Exp.find();
    res.send(exps);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.get("/:expId", async (req, res) => {
  try {
    const exp = await Exp.findById(req.params.expId);
    res.send(exp);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.post("/", async (req, res) => {
  try {
    const newExp = await Exp.create({
      ...req.body
    });
    newExp.save();

    const addExpToProfile = await Profile.findByIdAndUpdate(req.body.profile, {
      $push: {
        experiences: newExp._id
      }
    });
    addExpToProfile.save();
    res.json(newExp);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.put("/:expId", async (req, res) => {
  try {
    const editExp = await Exp.findByIdAndUpdate(
      req.params.expId,
      {
        $set: { ...req.body }
      },
      { new: true }
    );
    res.send(editExp);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.delete("/:expId", async (req, res) => {
  try {
    const deleteExp = await Exp.findByIdAndDelete(req.params.expId);
    deleteExp ? res.send(deleteExp) : res.send("ID not found");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

const upload = multer({});
router.post("/:expId/picture", upload.single("image"), async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname);
    const imgDest = path.join(
      __dirname,
      "../../images/exp/" + req.params.expId + ext
    );
    const imgServe =
      req.protocol +
      "://" +
      req.get("host") +
      "/images/exp/" +
      req.params.expId +
      ext;
    await writeFile(imgDest, req.file.buffer);
    const exp = await Exp.findOneAndUpdate(
      req.params.expId,
      { image: imgServe },
      { new: true }
    );
    res.send(exp);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/:username/csv", async (req, res) => {
  const exp = await Exp.find({ username: req.params.username });

  //the fields we use on the CSV
  const fields = ["username", "_id", "role", "company", "startDate", "endDate"];
  const opts = { fields };
  try {
    //https://www.npmjs.com/package/json2csv
    // const csv = parse(myData, opts);
    let csv = json2csv(exp, opts);
    res.setHeader('Content-disposition', 'attachment; filename=experiences.csv');
    res.set("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    return res.status(500).json({ err });
  }
});

module.exports = router;
