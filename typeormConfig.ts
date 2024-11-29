import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

for (const envName of Object.keys(process.env)){
    process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n');
}

     const AppDataSource = new DataSource({
        type:"postgres",
        host: process.env.POSTGRES_HOST,
        port: +(process.env.DB_PORT || 5432),
        database: process.env.POSTGRES_DB,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        url: process.env.DATABASE_URL,
        entities: ["src/entity/*.ts"],
        migrations: ['src/migrations/*.ts'],
        migrationsRun:true,
        synchronize: false,
        logging: false,
        
        
        
});

export default AppDataSource;
    

    
