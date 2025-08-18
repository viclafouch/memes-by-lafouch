export const toggleValue = <T>(value: T, values: T[]) => {
  if (values.includes(value)) {
    return values.filter((item) => {
      return item !== value
    })
  }

  return [...values, value]
}
