export function downloadBlob(blob: Blob, filename: string) {
  const element = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  element.href = url
  element.download = filename
  document.body.appendChild(element)
  element.click()
  window.URL.revokeObjectURL(url)
}
