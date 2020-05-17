const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
const morgan = require('morgan');
const port = global.process.env.PORT || 3000;

const app = express();
app.use(express.json())
app.use(morgan('dev'));
var students = [
    {id: 1, name : 'Student 1', age : 26},
    {id: 2, name : 'Student 2', age : 28},
    {id: 3, name : 'Student 3', age : 25},
];

const validation_schema = {
    name : Joi.string().min(3).max(12).required(),
    age: Joi.number().positive().required()
}

const validation_schema_put = {
    name : Joi.string().min(3).max(12),
    age: Joi.number().positive()
}
app.get('/api/students',(req,res)=>{
    res.send(students);
});

app.get('/api/students/id/:id',(req,res)=>{
    if(isNaN(parseInt(req.params.id)))
        return res.status(400).send(` ${req.params.id} is not a valid ID.`)
    const student = students.find(s => s.id === parseInt(req.params.id));
    if(!student)
        return res.status(404).send(`Student with id : ${req.params.id} not found.`)
    res.send(student);
});

app.post('/api/students',(req,res)=>{
    const result = Joi.validate(req.body,validation_schema);
    if(result.error)
        return res.status(400).send(result.error.details[0].message);
    const student = {
        id : students[students.length-1].id+1,//auto increment
        name: req.body.name,
        age : req.body.age
    }
    students.push(student);
    res.send(students);
});

app.delete('/api/students/id/:id',(req,res)=>{
    if(isNaN(parseInt(req.params.id)))
        return res.status(400).send(` ${req.params.id} is not a valid ID.`)
    const student = students.find(s => s.id === parseInt(req.params.id));
    if(!student)
        return res.status(404).send(`Student with id : ${req.params.id} not found.`)
    students = students.filter(s => s.id !== student.id);
    res.send(student);
});

app.put('/api/students/id/:id',(req,res)=>{
    const result = Joi.validate(req.body,validation_schema_put);
    if(result.error)
        return res.status(400).send(result.error.details[0].message);
    if(isNaN(parseInt(req.params.id)))
        return res.status(400).send(` ${req.params.id} is not a valid ID.`)
    let student = students.find(s => s.id === parseInt(req.params.id));
    if(!student)
        return res.status(404).send(`Student with id : ${req.params.id} not found.`)
    student = _.merge(student, req.body);
    res.send(student);
});


app.listen(port, ()=> console.log(`Server run on ${port}.`));