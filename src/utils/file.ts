export function getFilenameExtension(filename: string) {
  return filename.split('.').pop() as string
}

export function getFileExtension(file: File) {
  return getFilenameExtension(file.name)
}
