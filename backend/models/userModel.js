const mongoose=require('mongoose');
const bcrypt = require('bcryptjs')

const userModel=mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        pic:{
            type:String,
            required:false,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon"
        }
    },
    {timestamps:true}
);

userModel.pre('save', async function (next) {
    // 'this' refers to the document being saved
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password if it has been modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userModel.methods.matchPassword= async function (enterPassword){
    return await bcrypt.compare(enterPassword,this.password);
}

const User= mongoose.model('User',userModel);

module.exports=User;