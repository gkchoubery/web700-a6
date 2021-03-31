module.exports = (Sequelize, DataTypes) => {
    const department = Sequelize.define('department', {
        departmentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        departmentName: DataTypes.STRING
    });

    department.associate = models => {
        models.department.hasMany(models.employee, { foreignKey: 'department' });
    }

    return department;
}