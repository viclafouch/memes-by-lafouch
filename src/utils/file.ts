export function getFileExtension(file: File) {
  return file.name.split('.').pop() as string
}
