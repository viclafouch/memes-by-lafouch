import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const MemesToggleGrid = ({
  columnValue,
  onColumnValueChange
}: {
  columnValue: 3 | 5 | 6
  onColumnValueChange: (value: 3 | 5 | 6) => void
}) => {
  const handleChange = (value: string) => {
    if (value) {
      onColumnValueChange(parseInt(value, 10) as 3 | 5 | 6)
    }
  }

  return (
    <ToggleGroup
      size="default"
      variant="outline"
      type="single"
      value={columnValue.toString()}
      onValueChange={handleChange}
    >
      <ToggleGroupItem value="3">3</ToggleGroupItem>
      <ToggleGroupItem value="5">5</ToggleGroupItem>
      <ToggleGroupItem value="6">6</ToggleGroupItem>
    </ToggleGroup>
  )
}

export default MemesToggleGrid
