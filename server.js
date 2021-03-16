/**********************************************************************************
 *   WEB700–Assignment05
 *   I declare that this assignment is my own work in 
 *   accordance with Seneca  Academic Policy.  No part of this assignment has been 
 *   copied manually or electronically from any other source (including 3rd party 
 *   web sites) or distributed to other students.
 * 
 *   Name: Geet Kumar Choubey Student ID: 155876196 Date: 16 Mar 2021
 * 
 *   Online (Heroku) Link: 
 *******************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

const serverData = require('./modules/serverDataModule');
const { url } = require('inspector');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: {
        navLink: (url, options) => {
            return `
                <li class="nav-item ${url == app.locals.activeRoute ? 'active' : ''}">
                    <a class="nav-link" href="${url}">${options.fn(this)}</a>
                </li>
                `
        },
        equal: function (lValue, rValue, options) {
            if (arguments.length < 3) {
                throw new Error("Handlebars Helper equal needs 2 parameters");
            }
            if (lValue !== rValue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo');
});

app.get('/employees', (req, res) => {
    try {
        let departmentQuery = req.query.department;
        let queryResolver = () => {
            if (!departmentQuery) {
                return serverData.getAllEmployees();
            } else {
                return serverData.getEmployeesByDepartment(parseInt(departmentQuery));
            }
        };
        queryResolver(departmentQuery).then(data => {
            res.render('employees', { employees: data });
        }).catch(message => {
            res.render("employees", { message: "no results" });
        });

    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/employees/add', (req, res) => {
    res.render('addEmployee');
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
            .then(departments => res.render('departments', { departments }))
            .catch(message => res.status(404).send({ message }));
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/department/:num', (req, res) => {
    try {
        let departmentId = parseInt(req.params.num);
        serverData.getDepartmentById(departmentId)
            .then(department => res.render('department', { department }))
            .catch(message => res.render('department', { message }));
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
            .then(employee => res.render('employee', { employee }))
            .catch(message => res.render('employee', { message }));
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

