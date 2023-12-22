const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
// const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'restaurantOwner'],
    required: true,
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
});



// userSchema.methods.generateAuthToken = async function(){
//     const token = jwt.sign({_id:this._id.toString()},"thisismyrestroproject")
//     this.tokens = this.tokens.concat({token})
//     console.log(this);
//     await this.save();

//     return token
// }




const User = mongoose.model('User', userSchema);


module.exports = User;
