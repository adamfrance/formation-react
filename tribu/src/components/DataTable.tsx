import { useState } from 'react'
import type { ReactNode } from 'react'

// Une colonne : son titre, et deux fonctions fournies par le parent
export interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode // render prop : le parent décide de ce qu'affiche la cellule
  sortValue?: (row: T) => string | number // facultatif : si présente, la colonne est triable
}

interface DataTableProps<T> {
  rows: T[]
  columns: Column<T>[]
  rowKey: (row: T) => number | string
}

interface SortState {
  key: string
  asc: boolean
}

// Un tableau générique et triable : il ne connaît ni les collaborateurs ni leur affichage
function DataTable<T>({ rows, columns, rowKey }: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null) // l'état du tri vit dans le tableau

  const column = columns.find((c) => c.key === sort?.key)
  const sorted =
    sort && column?.sortValue
      ? [...rows].sort((a, b) => {
          const va = column.sortValue!(a)
          const vb = column.sortValue!(b)
          const order = va < vb ? -1 : va > vb ? 1 : 0
          return sort.asc ? order : -order
        })
      : rows

  const toggleSort = (key: string) =>
    setSort((prev) => (prev?.key === key ? { key, asc: !prev.asc } : { key, asc: true }))

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} aria-sort={sort?.key === c.key ? (sort.asc ? 'ascending' : 'descending') : undefined}>
              {c.sortValue ? (
                <button type="button" onClick={() => toggleSort(c.key)}>
                  {c.label} {sort?.key === c.key && (sort.asc ? '▲' : '▼')}
                </button>
              ) : (
                c.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={rowKey(row)}>
            {columns.map((c) => (
              <td key={c.key}>{c.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
