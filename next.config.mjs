/** @type {import('next').NextConfig} */
import fs from "fs";
import path from "path";
import { config } from "dotenv-safe";
import { fileURLToPath } from "url";

const createEnvFile = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const content = `APP_ENV=
APP_DEV_API_URL=
APP_PROD_API_URL=
`;

  fs.writeFileSync(`${__dirname}/.env`, content);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = __dirname + "/.env";

const { parsed: localEnv } = config({
  allowEmptyValues: true,
  path: fs.existsSync(envFile) ? envFile : createEnvFile(),
  example: envFile,
});

const nextConfig = {
  env: localEnv,
};

export default nextConfig;
