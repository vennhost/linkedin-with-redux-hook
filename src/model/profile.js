// PROFILE Model:
// {
//     "_id": "5d84937322b7b54d848eb41b", //server generated
//     "name": "Diego",
//     "surname": "Banovaz",
//     "email": "diego@strive.school",
//     "bio": "SW ENG",
//     "title": "COO @ Strive School",
//     "area": "Berlin",
//     "image": ..., //server generated on upload, set a default here
//     "username": "admin",
//     "createdAt": "2019-09-20T08:53:07.094Z", //server generated
//     "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
// }

const mongoose = require("mongoose");

////defining the schema
const Schema = mongoose.Schema;

//https://www.npmjs.com/package/mongoose-unique-validator
//mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema.
var uniqueValidator = require('mongoose-unique-validator');

//https://mongoosejs.com/docs/schematypes.html (Schema Types)
const profileSchema = new Schema({
  name: {
    type: String,
    required: [true, "User first name is required!"],
    minlength: 3,
    maxlength: 50
  },
  surname: {
    type: String,
    required: [true, "User last name is required!"],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User email is required!"]
  },
  bio: {
		type: String
	},
  title: {
		type: String
	},
  area: {
		type: String
	},
  imageProfile: {
		type: String,
		default: "http://via.placeholder.com/360x360"
	},
	username: {
		type: String,
		unique: true
  },
  experiences: [{ type: Schema.Types.ObjectId, ref: "Experience" }]
}, { timestamps: true});

//Applying the unique plugin to the schema:
profileSchema.plugin(uniqueValidator);


//To use the schema definition, we need to convert our PostSchema into a Model we can work with. 
//To do so, we pass it into mongoose.model(modelName, schema):
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
