const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcryptjs = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter an password'],
        minLength: [6, 'Minimun password length is 6 characters']
    }
});

//fire a function after doc saved db
userSchema.post('save', function(doc, next){
    next();
})


//fire a function before doc saved to db
userSchema.pre('save', async function(next){
    
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
})

//we can create static method to login userSchema
userSchema.statics.login = async function(email, password){
    //this: User model
    const user = await this.findOne({email});
    if(!user) throw Error('incorrect email');
    const validPass = await bcryptjs.compare(password, user.password);
    if(!validPass) throw Error('incorrect password');
    return user

}

module.exports = mongoose.model('User', userSchema);