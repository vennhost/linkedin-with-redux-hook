const express = require("express");
const router = express.Router();
const Profile = require("../model/profile");
const Exp = require("../model/experience");
const { check, validationResult } = require("express-validator");
const { writeFile } = require("fs-extra");
const multer = require("multer");
const path = require("path");
var PdfPrinter = require("pdfmake");

router.get("/", async (req, res) => {
  try {
    const response = await Profile.find().populate("experiences");
    // const response = await Profile.find();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const response = await Profile.findOne({
      username: req.params.username
    }).populate("experiences");
    response ? res.json(response) : res.json({});
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
router.post(
  "/",
  [
    check("email")
      .isEmail()
      .withMessage("A valid email is required!"),
    check("name")
      .exists()
      .withMessage("User first name is required!"),
    check("surname")
      .exists()
      .withMessage("User last name is required!"),
    check("username")
      .exists()
      .withMessage("A unique username is required!")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, surname, email, bio, title, area, username } = req.body;
    try {
      const response = await Profile.create({
        name,
        surname,
        email,
        bio,
        title,
        area,
        username
      });
      response.save();
      res.json(response);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  }
);
router.put("/:username", async (req, res) => {
  const { name, surname, title, area, bio, email } = req.body;
  let update = {};
  if (name) update = { ...update, name };
  if (surname) update = { ...update, surname };
  if (title) update = { ...update, title };
  if (area) update = { ...update, area };
  if (bio) update = { ...update, bio };
  if (email) update = { ...update, email };
  try {
    const response = await Profile.findOneAndUpdate(
      { username: req.params.username },
      update,
      { new: true }
    );
    response ? res.json(response) : res.json({});
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
const upload = multer({});
router.post("/:username/picture", upload.single("image"), async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname);
    const imgDest = path.join(
      __dirname,
      "../../images/profile/" + req.params.username + ext
    );
    const imgServe =
      req.protocol +
      "://" +
      req.get("host") +
      "/images/profile/" +
      req.params.username +
      ext;
    await writeFile(imgDest, req.file.buffer);
    const post = await Profile.findOneAndUpdate(
      req.params.postId,
      { image: imgServe },
      { new: true }
    );
    res.send(post);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
router.get("/:username/CV", async (req, res) => {
  const fonts = {
    Roboto: {
      normal: "./fonts/Roboto-Regular.ttf",
      bold: "./fonts/Roboto-Medium.ttf",
      italics: "./fonts/Roboto-Italic.ttf",
      bolditalics: "./fonts/Roboto-MediumItalic.ttf"
    }
  };
  const printer = new PdfPrinter(fonts);
  const userProfile = await Profile.findOne({ username: req.params.username });
  const userExpriences = await Exp.find({ username: req.params.username });

  console.log(userExpriences);
  const docDefinition = {
    content: [
      {//	'Images can be also provided in dataURL format...',
      //https://dopiaza.org/tools/datauri/index.php
        image:"data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z",
        width: 150,
        height: 150
      },
      {text: 'CV', style: 'header'},
      {text: 'Profile', style: 'header'},
      {
        ul: [
          {text: userProfile.name},
          {text: userProfile.surname},
          {text: userProfile.email}
        ]
      },
      {text: 'Experience', style: 'header'},
      {
        ul: [
          {text: userExpriences[0].company},
          {text: userExpriences[0].role}
        ]
      },
    ]
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  let chunks = [];
  let result;
  pdfDoc.on("data", chunk => {
    chunks.push(chunk);
  });
  pdfDoc.on("end", () => {
    result = Buffer.concat(chunks);
    res.contentType("application/pdf");
    res.send(result);
  });
  pdfDoc.end();
});
router.delete("/:id", async (req, res) => {
  try {
    const response = await Profile.findByIdAndDelete(req.params.id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = router;
