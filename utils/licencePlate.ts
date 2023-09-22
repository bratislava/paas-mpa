export const sanitizeLicencePlate = (licencePlate: string) => {
  // Even though the input is auto-capitalized, we still want to be sure that it's upper case.
  return licencePlate.toUpperCase().replaceAll(/\s/g, '')
}

export const isStandardFormat = (licencePlate: string) => {
  return licencePlate.length > 0 && /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(licencePlate)
}
