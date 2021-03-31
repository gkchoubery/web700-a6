const app = require('express').Router();
const serverData = require('../modules/serverDataModule');

app.post('/update', async (req, res) => {
    try {
        const { body: data } = req;
        await serverData.updateEmployee(data)
        res.redirect('/employees');
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

app.get('/:num', async (req, res) => {
    try {
        let employeeNum = parseInt(req.params.num);
        let employee = await serverData.getEmployeeByNum(employeeNum);
        if (employee) {
            let departments = await serverData.getDepartments();
            departments = departments.map(department => {
                if (department.departmentId === employee.department) {
                    department.selected = true;
                }
                return department;
            });
            let viewData = {
                employee: employee || null,
                departments: departments || []
            };
            return res.render('employee', { viewData });
        } else {
            res.status(404).send({ message: `No results for employee with Employee ID: ${employeeNum}` })
        }
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
});

module.exports = app;