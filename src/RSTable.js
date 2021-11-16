import React from 'react'
import './RSTable.css'

const RSTable = props => {
  const columns = props.columns
  const body = props.data.map((dataRow, index) => (
    <tr key={index}>
      <th scope="row">{dataRow.total || index}</th>
      {columns.map(column => <td key={column} style={props.highlight ? props.highlight(dataRow, column) : {}}>{dataRow[column] === undefined ? "" : dataRow[column]}</td>)}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>
          <td>#</td>
          {columns.map(column => <td key={column}>{column}</td>)}
        </tr>
      </thead>
      <tbody>
        {body}
      </tbody>
    </table>
  )
}

export default RSTable