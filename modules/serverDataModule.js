const fs = require('fs');
const moment = require('moment');

class Data {
    constructor(employees, departments) {
        this.employees = employees;
        this.departments = departments;
    }
}

let allData = null;

/**
 * Promisify readFile function
 * @param {String} path of the file
 * @param {String} encoding to be used for opening the file
 * @returns {Promise<Buffer>} returns the data as a buffer
 */
function readFile(path, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        })
    });
}

/**
 * Initialize function will invoke the promisified readFile function and parse the JSON data
 * Instantiate Data class and store the JSON
 * @returns {Promise<any>} 
 */
module.exports.initialize = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let employeeDataFromFile = await readFile('./data/employees.json')
                .then(data => JSON.parse(data));
            let departmentDataFromFile = await readFile('./data/departments.json')
                .then(data => JSON.parse(data));
            allData = new Data(employeeDataFromFile, departmentDataFromFile);
            resolve();
        } catch (e) {
            e.mesage = 'Error while trying to read JSON data';
            reject(e);
        }

    });
}


/**
 * Method will return all employees else will throw an error
 * @returns {Promse<any>} employeeData || errorMessage
 */
module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        const allEmployees = allData.employees;
        if (allEmployees && allEmployees.length > 0) return resolve(allEmployees);
        reject('No results returned for \'Employees\'');
    });
}

/**
 * Method will return all employees who have a manger
 * @returns {Promse<any>} employeeData || errorMessage
 */
module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
        const allManagers = allData.employees.filter(employee => !!employee.isManager);
        if (allManagers && allManagers.length > 0) return resolve(allManagers);
        reject('No results returned for \'Managers\'');
    });
}

/**
 * Method will return all employees else will throw an error
 * @returns {Promse<any>} departmentData || errorMessage
 */
module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        const allDepartments = allData.departments;
        if (allDepartments && allDepartments.length > 0) return resolve(allDepartments);
        reject('No results returned for \'Departments\'');
    });
}

module.exports.getEmployeesByDepartment = department => {
    return new Promise((resolve, reject) => {
        let employees = allData.employees.filter(employee =>
            employee.department === department);
        if (employees.length > 0) {
            resolve(employees);
        } else {
            reject(`No results for employees in Department# ${department}`);
        }
    });
}

module.exports.getEmployeeByNum = num => {
    return new Promise((resolve, reject) => {
        let employeeFound = allData.employees.find(employee =>
            employee.employeeNum === num);
        if (employeeFound) {
            resolve(employeeFound);
        } else {
            reject(`No results for employee with Employee ID: ${num}`);
        }
    });
}

module.exports.getDepartmentById = id => {
    return new Promise((resolve, reject) => {
        let departmentFound = allData.departments.find(department =>
            department.departmentId === id);
        if (departmentFound) {
            resolve(departmentFound);
        } else {
            reject(`No results for department with Department ID: ${id}`);
        }
    });
}



module.exports.addEmployee = employeeData => {
    return new Promise(async (resolve, reject) => {
        try {
            if (employeeData.employeeManagerNum) {
                employeeData.employeeManagerNum = parseInt(employeeData.employeeManagerNum)
                let manager = await this.getEmployeeByNum(employeeData.employeeManagerNum);
                if (!manager) {
                    throw new Error('Manager not found');
                }
            }
            if (!employeeData.isManager) employeeData.isManager = false;
            employeeData.department = parseInt(employeeData.department);
            employeeData.hireDate = moment(employeeData.hireDate, 'YYYY-MM-DD').format('M/D/YYYY')
            let employee = Object.assign({}, {
                employeeNum: allData.employees.length + 1
            }, employeeData);
            allData.employees.push(employee);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

}