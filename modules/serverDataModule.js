const moment = require('moment');
const db = require('../models');

let cleanData = employeeData => {
    if (typeof (employeeData.employeeManagerNum) === 'string') {
        employeeData.employeeManagerNum = employeeData.employeeManagerNum ? parseInt(employeeData.employeeManagerNum) : null;
    }
    if (employeeData.employeeNum && typeof (employeeData.employeeNum) === 'string') {
        employeeData.employeeNum = parseInt(employeeData.employeeNum)
    }
    if (employeeData.department && typeof (employeeData.department) === 'string') {
        employeeData.department = parseInt(employeeData.department)
    }
    if (employeeData.isManager && employeeData.isManager === 'on') {
        employeeData.isManager = true;
    } else {
        employeeData.isManager = false;
    }
    return employeeData;
}

/**
 * Initialize function will invoke the promisified readFile function and parse the JSON data
 * Instantiate Data class and store the JSON
 * @returns {Promise<any>} 
 */
module.exports.initialize = async () => {
    try {
        await db.sequelize.sync();
    } catch (e) {
        console.error(e);
        throw new Error('Error: Unable to sync the database');
    }
}

module.exports.seedData = async (seed = false) => {
    await db.sequelize.sync({ force: true });
    if (seed) {
        await db.department.bulkCreate(require('../data/departments.json').map(department => ({
            departmentName: department.departmentName
        })));
        await db.employee.bulkCreate(require('../data/employees.json').splice(0, 20).map(employee => {
            delete employee.employeeNum
            return employee;
        }));
    }
}


/**
 * Method will return all employees else will throw an error
 * @returns {Promse<any>} employeeData || errorMessage
 */
module.exports.getAllEmployees = () => {
    return db.employee.findAll({
        raw: true,
        order: ["employeeNum"]
    });
}

/**
 * Method will return all employees who have a manger
 * @returns {Promse<any>} employeeData || errorMessage
 */
module.exports.getManagers = () => {
    return db.employee.findAll({
        where: {
            isManager: true
        },
        raw: true,
        order: ["employeeNum"]
    });
}

/**
 * Method will return a manager
 * @returns {Promse<any>} employeeData
 */
module.exports.getManager = async id => {
    return db.employee.findOne({
        where: {
            employeeNum: id,
            isManager: true
        }
    });
}

/**
 * Method will return all departments
 * @returns {Promse<any>} departmentData
 */
module.exports.getDepartments = () => {
    return db.department.findAll({
        raw: true,
        order: ["departmentId"]
    });
}

module.exports.getEmployeesByDepartment = department => {
    return db.employee.findAll({
        where: {
            department
        },
        raw: true,
        order: ["employeeNum"]
    });
}

module.exports.getEmployeeByNum = num => {
    return db.employee.findOne({
        where: {
            employeeNum: num
        },
        raw: true
    });
}

module.exports.getDepartmentById = id => {
    return db.department.findOne({
        where: {
            departmentId: id
        },
        raw: true
    });
}



module.exports.addEmployee = async employeeData => {
    employeeData = cleanData(employeeData);
    if (employeeData.employeeManagerNum) {
        let manager = await this.getManager(employeeData.employeeManagerNum);
        if (!manager) {
            throw new Error('Manager not found');
        }
    }
    employeeData.hireDate = moment(employeeData.hireDate, ['YYYY-MM-DD', 'M/D/YYYY']).format('M/D/YYYY');
    await db.employee.create(employeeData);
}

module.exports.updateEmployee = async employeeData => {
    employeeData = cleanData(employeeData);
    let employee = await db.employee.findOne({
        where: {
            employeeNum: employeeData.employeeNum
        },
        raw: true
    });
    if (employee) {
        if (employeeData.employeeManagerNum) {
            let manager = await this.getManager(employeeData.employeeManagerNum);
            if (!manager) throw new Error(`Manager not found with ID ${employeeData.employeeManagerNum}`)
        }
        await db.employee.update(employeeData, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        })
    } else {
        await this.addEmployee(employeeData);
    }
}

module.exports.deleteEmployee = employeeNum => {
    return db.employee.destroy({
        where: {
            employeeNum
        }
    });
}

module.exports.addDepartment = ({ departmentName }) => {
    return db.department.create({
        departmentName
    });
}

module.exports.updateDepartment = ({ departmentId, departmentName }) => {
    return db.department.update({
        departmentName
    }, {
        where: {
            departmentId
        }
    });
}

module.exports.deleteDepartment = departmentId => {
    return db.department.destroy({
        where: {
            departmentId
        }
    });
}