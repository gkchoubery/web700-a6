const app = require('express').Router();
const serverData = require('../modules/serverDataModule');

app.get('/:num', async (req, res) => {
    try {
        let departmentId = parseInt(req.params.num);
        let department = await serverData.getDepartmentById(departmentId);
        if (department) return res.render('department', { department });
        res.status(404).render('department', { message: `No results for department with Department ID: ${departmentId}` });
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.post('/update', async (req, res) => {
    try {
        await serverData.updateDepartment(req.body);
        res.redirect('/departments');
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

module.exports = app;