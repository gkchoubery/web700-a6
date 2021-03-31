const app = require('express').Router();
const serverData = require('../modules/serverDataModule');


app.get('/', async (req, res) => {
    try {
        let departmentQuery = req.query.department;
        let queryResolver = () => {
            if (!departmentQuery) {
                return serverData.getAllEmployees();
            } else {
                return serverData.getEmployeesByDepartment(parseInt(departmentQuery));
            }
        };
        let data = await queryResolver(departmentQuery);
        if (data.length > 0) {
            res.render('employees', { employees: data });
        } else {
            res.render("employees", { message: "No employee record available" });
        }

    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

app.get('/add', async (req, res) => {
    let departments = await serverData.getDepartments();
    res.render('addEmployee', { departments });
});

app.post('/add', async (req, res) => {
    try {
        await serverData.addEmployee(req.body);
        res.redirect('/employees');
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

app.get('/delete/:num', async (req, res) => {
    try {
        let result = await serverData.deleteEmployee(req.params.num);
        if(result) return res.redirect('/employees');
        throw new Error('Unable to Remove Employee / Employee found');
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: e.message
        })
    }
});

module.exports = app;