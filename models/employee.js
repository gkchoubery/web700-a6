module.exports = (Sequelize, DataTypes) => {
    const employee = Sequelize.define('employee', {
        employeeNum: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        SSN: DataTypes.STRING,
        addressStreet: DataTypes.STRING,
        addressCity: DataTypes.STRING,
        addressState: DataTypes.STRING,
        isManager: DataTypes.BOOLEAN,
        employeeManagerNum: DataTypes.INTEGER,
        status: DataTypes.STRING,
        hireDate: DataTypes.STRING
    });

    return employee;
}