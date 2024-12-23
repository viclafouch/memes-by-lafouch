export function downloadBlob(blob: Blob, filename: string) {
  const anchorElement = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  anchorElement.href = url
  anchorElement.download = filename
  document.body.appendChild(anchorElement)
  anchorElement.click()
  window.URL.revokeObjectURL(url)
}
