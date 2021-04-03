const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://test_user:hbN0W0ugSBSk1pHi@cluster0.qogmr.mongodb.net/ninja_users_jwt_db';
const dbConnection = async() => {
    try{
        await mongoose.connect(dbURI, 
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true, 
                useCreateIndex:true 
            },()=>{
            console.log('Db connect');
          })
    }catch(error){
        console.log('Error in DB connection');
    }
}

module.exports = {
    dbConnection,
}