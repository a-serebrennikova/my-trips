import bcrypt from "bcryptjs";

const parsedRounds = Number(process.env.BCRYPT_ROUNDS ?? "12");
const SALT_ROUNDS =
  Number.isFinite(parsedRounds) && parsedRounds >= 4 ? parsedRounds : 12;

export const saltAndHashPassword = async (
  password: string,
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};
