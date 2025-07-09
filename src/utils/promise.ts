export async function wait(
  timeout: number,
  { throwInstead }: { throwInstead: boolean } = { throwInstead: false }
) {
  await new Promise((resolve, reject) => {
    setTimeout(throwInstead ? reject : resolve, timeout)
  })
}
