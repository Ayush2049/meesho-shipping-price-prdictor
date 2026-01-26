export const isValidName = (name) =>
  typeof name === "string" && name.trim().length >= 2;



export const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone); // Indian numbers

export const isValidPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);

export const isValidOTP = (otp) =>
  /^\d{6}$/.test(otp);
