/**
 * Function to check if email is valid
 * @param email email address to check validity
 * @returns boolean value indicating if email is valid
 */
export const isValidEmail = (email: string) => {
  const reg: RegExp = /^[\w-+.]+@([\w-]+\.)+[\w-]{2,4}$/

  return reg.test(String(email).toLowerCase())
}
