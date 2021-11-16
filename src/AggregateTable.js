import React from 'react'
import './RSTable.css'

const AggregateTable = props => {
  let entries = []
  for (const [rarity, dataSection] of Object.entries(props.data)) {
    const style = {
      color: props.pullColors[rarity] || '#000000',
      fontWeight: 'light'
    }
    entries = entries.concat(Object.entries(dataSection).map(([name, quantity]) => (
      {
        style,
        rarity,
        name: name,
        quantity: quantity,
      }
    )))
  }

  entries.sort((a,b) => {
    if(a.rarity !== b.rarity) return b.rarity - a.rarity
    else return b.quantity - a.quantity
  })

  const tableRows = entries.map(entry => (
    <tr key={entry.name}>
      <td style={entry.style}>{entry.rarity}</td>
      <td style={entry.style}>{entry.name}</td>
      <td style={entry.style}>{entry.quantity}</td>
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>
          <td>Rarity</td>
          <td>Name</td>
          <td>Quantity</td>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>
  )
}

export default AggregateTable