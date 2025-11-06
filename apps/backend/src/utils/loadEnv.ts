import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

type TConfig = {
  SERVER_PORT: number;
  DATABASE_URL: string;
};

const config: TConfig = {
  SERVER_PORT: env.get("SERVER_PORT").required().asPortNumber(),
  DATABASE_URL: env.get("DATABASE_URL").required().asString(),
};

export default config;
