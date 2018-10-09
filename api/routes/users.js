const express = require('express');
const router = express.Router();
const Joi = require('joi');

/* 'DATABASE' */
const users = require('../models/users');

router.get('/', async (req, res) => {
    res.send(await users.getAll())
});

router.post('/', async (req, res) => {

    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email; 
    const password = req.body.password;
    const data_nasc = req.body.data_nasc;
    
    const { error } = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    const user = await users.create({username, name, email, password, data_nasc});
    return res.send(user);
});

router.get('/:username', async (req, res) => {
    const user = await users.get(req.params.username);
    if (!user) return res.status(404).send('The user with given id was not found.');
    res.send(user);
});

router.put('/:username', async (req, res) => {
    let user = await users.get(req.params.username);
    if (!user) return res.status(404).send('The user with given id was not found.');

    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email; 
    const password = req.body.email;
    const data_nasc = req.body.data_nasc;
    
    const { error } = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    user = await users.create({username, name, email, password, data_nasc});

    res.send(user);
});

router.delete('/:username', async (req, res) => {
    let user = await users.get(req.params.username);
    if (!user) return res.status(404).send('The user with given id was not found.');

    user =  users.delete(user.username);
    res.send(user);
})

function validateUser({username, name, email, password, data_nasc}){
    const userSchema = Joi.object().keys({
        username: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        password: Joi.string().min(3).required()
    });

    return Joi.validate({username, name, email, password}, userSchema);
}

module.exports = router;