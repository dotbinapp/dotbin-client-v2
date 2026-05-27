import { Skeleton } from '@shared/ui/atoms'

interface BaseTableSkeletonRowsProps {
  columnCount: number
  rowCount: number
}

function BaseTableSkeletonRows({ columnCount, rowCount }: Readonly<BaseTableSkeletonRowsProps>) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr key={`table-skeleton-${rowIndex}`}>
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <td className="border-r border-ui-border px-3 py-2 last:border-r-0" key={`table-skeleton-${rowIndex}-${columnIndex}`}>
          <Skeleton size="md" />
        </td>
      ))}
    </tr>
  ))
}

export default BaseTableSkeletonRows
