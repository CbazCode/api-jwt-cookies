const User = require("../models/User");
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    let errors = {email:'',password:'' };

    //Incorrect email
	if (err.message === 'incorrect email') {
		errors.email = 'That email is not registered';
	}
	//Incorrect pass
	if (err.message === 'incorrect password') {
		errors.password = 'That password is incorrect';
	}
    //duplicate error code
    if(err.code === 11000){
        errors.email ='that email is already registered'
        return errors;
    }
    //validation handleErrors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;

}

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id) => {
    const token = jwt.sign({id},'SECRET_W00RD',{
        expiresIn: MAX_AGE
    });

    return token;
}


module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    
    res.render('login');
}

module.exports.signup_post = async(req, res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.create({email, password});
        const token =  createToken(user._id);
        console.log(token);
        res.cookie('jwt', token, {httpOnly: true, maxAge: MAX_AGE * 1000});
        return res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({errors});
    }
    // res.send('new signup');
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
        console.log(token);
		res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
		res.status(200).json({ user: user._id });
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({ errors });
	}

}

