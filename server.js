/**********************************************************************************
 *   WEB700–Assignment06
 *   I declare that this assignment is my own work in 
 *   accordance with Seneca  Academic Policy.  No part of this assignment has been 
 *   copied manually or electronically from any other source (including 3rd party 
 *   web sites) or distributed to other students.
 * 
 *   Name: Geet Kumar Choubey Student ID: 155876196 Date: 5 Apr 2021
 * 
 *   Online (Heroku) Link: https://radiant-island-69672.herokuapp.com/
 *******************************************************************************/

require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

const serverData = require('./modules/serverDataModule');

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
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

app.get('/seedData', async (req, res) => {
    try {
        await serverData.seedData();
        res.redirect('/');
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

app.use('/employees', require('./routes/employees'));
app.use('/employee', require('./routes/employee'));
app.use('/departments', require('./routes/departments'));
app.use('/department', require('./routes/department'));

app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/notFound.html'));
})

serverData.initialize().then(_ => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(e => console.error(e));

