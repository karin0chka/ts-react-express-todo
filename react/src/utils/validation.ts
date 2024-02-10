// import { isEmail } from "validator"

// export const rules = {
//   required: (val: string): boolean | string => !!val.length,
//   email: (val: string): boolean | string => isEmail(val),
//   emailMaxLength: (val: string): boolean | string => val?.length < 100,
//   nameMinLength: (val: string) => val.length > 1,
//   nameMaxLength: (val: string) => val.length < 40,
//   strongPasswordCheck: (password: string): boolean | string => {
//     const checking =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
//     return checking.test(password)
//   },
//   comparePasswords: (password: string, repeatPassword: string): boolean =>
//  password.length && password === repeatPassword,
// }
