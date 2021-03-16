/**********************************************************************************
 *   WEB700–Assignment 04*  I declare that this assignment is my own work in 
 * accordance with Seneca  Academic Policy.  No part of this assignment has been 
 * copied manually or electronically from any other source (including 3rd party 
 * web sites) or distributed to other students.
 * 
 * Name: Geet Kumar Choubey Student ID: 155876196 Date: 9 Mar 2021
 * 
 * Online (Heroku) Link: https://fast-mountain-05477.herokuapp.com/
 *******************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const serverData = require('./modules/serverDataModule');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/htmlDemo.html'));
});

app.get('/employees', (req, res) => {
    try {
        let departmentQuery = req.query.department;
        if (!departmentQuery) {
            serverData.getAllEmployees()
                .then(employees => res.send(employees))
                .catch(message => res.status(404).send({ message }));;
        } else {
            serverData.getEmployeesByDepartment(parseInt(departmentQuery))
                .then(employees => res.send(employees))
                .catch(message => res.status(404).send({ message }));
        }
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/employees/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/addEmployee.html'));
});

app.post('/employees/add', async (req, res) => {
    try {
        await serverData.addEmployee(req.body);
        res.redirect('/employees');
    } catch (e) {
        res.status(500).send({
            message: e
        });
    }
});


app.get('/managers', (req, res) => {
    try {
        serverData.getManagers()
            .then(managers => res.send(managers))
            .catch(message => res.status(404).send({ message }));
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/departments', (req, res) => {
    try {
        serverData.getDepartments()
            .then(departments => res.send(departments))
            .catch(message => res.status(404).send({ message }));
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/employee/:num', (req, res) => {
    try {
        let employeeNum = parseInt(req.params.num);
        serverData.getEmployeeByNum(employeeNum)
            .then(employee => res.send(employee))
            .catch(message => res.status(404).send({ message }));
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/notFound.html'));
})

serverData.initialize().then(_ => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(e => console.error(e));

