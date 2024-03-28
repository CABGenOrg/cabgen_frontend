/** @type {import('next').NextConfig} */
import path from "path";
import { config } from "dotenv-safe";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { parsed: localEnv } = config({
  allowEmptyValues: false,
  example: __dirname + "/.env",
  path: __dirname + "/.env",
});

const nextConfig = {
  env: localEnv,
};

export default nextConfig;
