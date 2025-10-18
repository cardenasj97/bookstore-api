export type Env = {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
};
