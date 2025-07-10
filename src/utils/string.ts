export const stringToFilename = (value: string) => {
  return value.toLowerCase().trim().replaceAll(' ', '-').normalize('NFD')
}
