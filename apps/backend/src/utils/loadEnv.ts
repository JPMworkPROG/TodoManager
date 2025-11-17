import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

type TConfig = {
  PORT: number;
  DATABASE_URL: string;
};

const config: TConfig = {
  PORT: env.get("PORT").required().asPortNumber(),
  DATABASE_URL: env.get("DATABASE_URL").required().asString(),
};

export default config;
