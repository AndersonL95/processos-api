import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../services/db";

interface UserAtt{
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    cargo: string;
    createdAt?: Date;
    updatedAt?: Date

}
interface UserCreationAtt extends Optional<UserAtt, 'id'>{}


export class User extends Model<UserAtt, UserCreationAtt> implements UserAtt {
    public id!: number;
    public name!: string;
    public phone!: string;
    public cpf!: string;
    public cargo!: string;
    public password!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;


}
User.init(
    {
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
    },
    {
        sequelize,
        tableName: 'Users'
    }
)


