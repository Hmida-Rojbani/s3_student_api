const express = require('express');
const port = global.process.env.PORT || 3000;

const app = express();
app.use(express.json())
var students = [
    {id: 1, name : 'Student 1', age : 26},
    {id: 2, name : 'Student 2', age : 28},
    {id: 3, name : 'Student 3', age : 25},
];

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
    const student = {
        id : students[students.length-1].id+1,//auto increment
        name: req.body.name,
        age : req.body.age
    }
    students.push(student);
    res.send(students);
});

app.listen(port, ()=> console.log(`Server run on ${port}.`));