const app = require('express').Router();
const serverData = require('../modules/serverDataModule');

app.get('/', async (req, res) => {
    try {
        let departments = await serverData.getDepartments();
        if (departments.length > 0) {
            res.render('departments', { departments })
        } else {
            res.status(404).render('departments', { message: 'No records available for Departments' })
        }
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/add', (req, res) => {
    res.render('addDepartment');
});

app.post('/add', async (req, res) => {
    try {
        await serverData.addDepartment(req.body);
        res.redirect('/departments');
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/delete/:num', async (req, res) => {
    try {
        let result = await serverData.deleteDepartment(req.params.num);
        if(result) return res.redirect('/departments');
        throw new Error('Unable to Remove Department / Department not found');
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: e.message
        })
    }
});

module.exports = app;