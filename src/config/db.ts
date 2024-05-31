import { DataSource, DataSourceOptions} from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

for (const envName of Object.keys(process.env)){
    process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n');
}

    const dataSourceOptions: DataSourceOptions ={
        type:"postgres",
        host: process.env.POSTGRES_HOST,
        port: +(process.env.DB_PORT || 5432),
        database: process.env.POSTGRES_DB,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        entities: [__dirname+'/../**/*.entity.{ts}'],
        migrations: [__dirname+'/migrations/*.{ts}'],
        migrationsTransactionMode: 'each',
        
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
    

    
