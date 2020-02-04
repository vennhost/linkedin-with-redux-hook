const express = require("express");
const router = express.Router();
const { writeFile } = require("fs-extra");

//connecting to the Post Model(schema)
const Post = require("../model/post");

//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer = require("multer");
const path = require("path");

router.get("/", async (req, res) => {
  //.find will find us all the parameters in the Post {_id,text,username,createdAt,updatedAt,image}
  const posts = await Post.find({}).populate("profileID");
  res.send(posts);
});

router.get("/:postId", async (req, res) => {
  try {
    //Finds a single document by its _id field. findById(id) is almost equivalent to findOne({ _id: id }).
    //const post =await Post.findOne({userId = req.params.postId})
    const post = await Post.findById(req.params.postId).populate({
      path: "profile",
      select: "image name surname"
    });
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.log();
    res.json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    //Documents are inserted with .create, save() this function triggers the middleware.
    const newPost = await Post.create(req.body);
    newPost.save();
    res.send(newPost);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:postId", async (req, res) => {
  try {
    //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      { $set: { ...req.body } },

      //we should set the new option to true to return the document after update was applied.
      { new: true }
    );
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    //findOneAndDelete() command finds a matching document, removes it, and passes the found document (if any) to the callback.
    const post = await Post.findOneAndDelete({ _id: req.params.postId });
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

//https://www.npmjs.com/package/multer
//var upload = multer({ dest: 'uploads/' })
const upload = multer({});

// req.file is the `image` file
router.post("/:postId/picture", upload.single("image"), async (req, res) => {
  try {
    //const fileName = req.params.asin + path.extname(req.file.originalname)
    //create a new filename for existing path "ASIN.ext"
    const ext = path.extname(req.file.originalname);

    //Create a path where the image should be stored + as we need "/postId" + ext
    const imgDest = path.join(
      __dirname,
      "../../images/post/" + req.params.postId + ext
    );

    //const imgServe = req.protocol + '://' + req.get('host') + "/images/" + fileName;
    // serve is the webstite link we use to get image protocol:https, host:localhost,
    const imgServe =
      req.protocol +
      "://" +
      req.get("host") +
      "/images/post/" +
      req.params.postId +
      ext;
    await writeFile(imgDest, req.file.buffer);
    console.log(imgDest);
    const post = await Post.findOneAndUpdate(
      req.params.postId,
      { imagePost: imgServe },
      { new: true }
    );
    res.send(post);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
