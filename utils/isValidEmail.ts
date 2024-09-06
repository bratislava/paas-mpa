/**
 * Function to check if email is valid with regex:
 * '.*' zero or more of any characters,
 * '@' matches the "@" symbol,
 * '.*' zero or more of any characters,
 * '\.' matches escaped "." character,
 * '.*' zero or more of any characters,
 * @param email email address to check validity
 * @returns boolean value indicating if email is valid
 */
export const isValidEmail = (email: string) => {
  const reg: RegExp = /.*@.*\..*/

  return reg.test(email)
}
