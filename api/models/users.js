const mongoose = require('mongoose');

// CONNECT TO DB
mongoose.connect('mongodb://localhost/bluehack_fleury')
    .then(() => console.log('Connected to mongodb.'))
    .catch(err => console.log('Could not connect to mongodb... \n', err));

// CREATING A SCHEMA FOR USER MODEL
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    data_nasc: Date,
    createdAt: { type: Date, default: Date.now },
});

// CREATING THE USER MODEL WITH USER SCHEMA
const User = mongoose.model('User', userSchema);

async function getAllUsers(){
    return await User.find();
}

async function getUser(username){
    return await User.findOne({username: username});
}

async function createUser({username, name, email, password, data_nasc}){
    // INSTANCING A COURSE OBJECT
    const user = new User({
        username,
        name, 
        email,
        password,
        data_nasc
    });

    const users = await User.count({username: username});
    if(users) return ;

    // SAVING INTO DATABASE
    const result = await user.save();
    return result;
}

async function updateUser({username, name, email, password, data_nasc}){
    const user =  await getUser(username);
    if(!user) return;

    user.username = username;
    user.name = name;
    user.password = password;
    user.email = email;
    user.data_nasc = data_nasc;

    const result = await user.save();
    return result;
}

async function deleteUser(username){
    const course = await User.findOneAndRemove({username: username});
    return course;
}

module.exports.get = getUser;
module.exports.getAll = getAllUsers;
module.exports.create = createUser;
module.exports.update = updateUser;
module.exports.delete = deleteUser;
