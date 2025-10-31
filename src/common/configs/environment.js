import dotenv from "dotenv";
import z from "zod";

dotenv.config({});

const envVarsSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number().default(8000),
  HOST: z.string().min(1).default("127.0.0.1"),
  DB_URI: z.string().min(1).describe("Local Mongo DB"),
  API_URL: z.string(),
  CLIENT_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRED: z.string().default("30d"),
  JWT_VERIFY_SECRET: z.string(),
  JWT_VERIFY_EXPIRED: z.string().default("1d"),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),
});
const result = envVarsSchema.safeParse(process.env);
if (!result.success) {
  result.error.issues.forEach((issue) => {
    console.error(`❌ Field "${issue.path.join(".")}" - ${issue.message}`);
  });
  console.error(
    "⛔ Stopping application due to missing environment variables.",
  );
  process.exit(1);
}
const envVars = result.data;

export const {
  NODE_ENV,
  PORT,
  HOST,
  DB_URI,
  API_URL,
  CLIENT_URL,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRED,
  JWT_VERIFY_SECRET,
  JWT_VERIFY_EXPIRED,
  MAIL_USER,
  MAIL_PASS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} = envVars;
