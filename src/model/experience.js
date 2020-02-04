/* EXPERIENCE Model:
    {
        "_id": "5d925e677360c41e0046d1f5",  //server generated
        "role": "CTO",
        "company": "Strive School",
        "startDate": "2019-06-16T22:00:00.000Z",
        "endDate": "2019-06-16T22:00:00.000Z", //could be null
        "description": "Doing stuff here and there",
        "area": "Berlin",
        "username": "admin",
        "createdAt": "2019-09-30T19:58:31.019Z",  //server generated
        "updatedAt": "2019-09-30T19:58:31.019Z",  //server generated
        "image": ... //server generated on upload, set a default here
    }  */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//https://www.npmjs.com/package/mongoose-unique-validator
//mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema.
var uniqueValidator = require("mongoose-unique-validator");

// function that validate the startDate and endDate
function dateValidator(endDate) {
  // `this` is the mongoose document
  return this.startDate < endDate;
}

//https://mongoosejs.com/docs/schematypes.html (Schema Types)
const expSchema = new Schema(
  {
    // profile: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
    role: {
      type: String,
      required: [true, "Role is required!"]
    },
    company: {
      type: String,
      required: [true, "Company is required!"],
      minlength: 3,
      maxlength: 150
    },
    startDate: {
      type: Date,
      required: true,
      max: [new Date(), "Experience start date should be before today."]
    },
    endDate: {
      type: Date,
      validate: [dateValidator, "Start Date must be less than End Date"]
    },
    description: {
      type: String
    },
    area: {
      type: String
    },
    username: {
      type: String,
      required: true
    },
    imageExperience: {
      type: String,
      default: "http://via.placeholder.com/360x360"
    }
  },
  { timestamps: true }
);

//Applying the unique plugin to the schema:
expSchema.plugin(uniqueValidator);

const Exp = mongoose.model("Experience", expSchema);

module.exports = Exp;
