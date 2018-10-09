const express = require('express');
const router = express.Router();
const Joi = require('joi');

/* 'DATABASE' */
const exams = require('../models/exams');

router.get('/', async (req, res) => {
    console.log(req.query.q);
    res.json({exams: await exams.getAll(req.query.q)});
});

router.post('/', async (req, res) => {

    const name = req.body.name;
    const tags = req.body.tags; 
    
    const { error } = validateExam(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    const exam = await exams.create({name, tags});
    return res.send(exam);
});

router.get('/:slug', async (req, res) => {
    const exam = await exams.get(req.params.slug);
    if (!exam) return res.status(404).send('The exam with given slug was not found.');
    res.send(exam);
});

router.put('/:slug', async (req, res) => {
    let exam = await exams.get(req.params.slug);
    if (!exam) return res.status(404).send('The exam with given slug was not found.');

    const name = req.body.name;
    const tags = req.body.tags;
    
    const { error } = validateexam(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    exam = await exams.create({name, tags});

    res.send(exam);
});

router.delete('/:slug', async (req, res) => {
    let exam = await exams.get(req.params.slug);
    if (!exam) return res.status(404).send('The exam with given slug was not found.');

    exam =  exams.delete(exam.id);
    res.send(exam);
})

function validateExam({name, tags}){
    const examSchema = Joi.object().keys({
        name: Joi.string().min(3).required(),
        tags: Joi.required()
    });

    return Joi.validate({name, tags}, examSchema);
}

module.exports = router;