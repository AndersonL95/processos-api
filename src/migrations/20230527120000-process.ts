import { QueryInterface, DataTypes} from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('Users', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            
            cpf: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cargo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
    
            },
            createdAt:{
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt:{
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: async (queryInterface: QueryInterface) =>{
        await queryInterface.dropTable("Users");
    }
    
};
