import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};
