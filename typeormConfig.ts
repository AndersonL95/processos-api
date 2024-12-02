import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n');
}

 const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["src/entity/*.ts"],
    migrations: ['src/migrations/*.ts'],
    migrationsRun: true,
    synchronize: false, 
    logging: false, 
});

export default AppDataSource;
