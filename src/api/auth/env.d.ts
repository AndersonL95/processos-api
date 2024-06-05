declare namespace NodeJS {
    interface ProcessEnv {
        SECRET_KEY_JWT: string;
        REFRESH_SECRET_KEY: string
    }
}