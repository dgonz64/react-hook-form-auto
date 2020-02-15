import React from 'react'
// import { renderLectures } from './renderLectures'

import { trField } from '../../translation_utils'
import { trPath } from '../../utils'

const renderRemove = ({ idx, closeButton }) =>
  <td key={idx}>
    {closeButton}
  </td>

const renderTableHeader = ({ schema }) => {
  const subType = schema.getType()
  const schemaDef = schema.getSchema()
  const fields = Object.keys(schemaDef)

  return (
    <tr>
      <th />
      {
        fields.map(sub =>
          <th key={sub}>
            {trField(subType, sub)}
          </th>
        )
      }
    </tr>
  )
}

const renderItems = ({ items }) =>
  items.map(({ idx, closeButton, inputs }) => {
    const tdedInputs = inputs && inputs.map(input => {
      return (
        <td key={input.props.name}>
          {input}
        </td>
      )
    })

    return (
      <tr key={idx}>
        {renderRemove({ idx, closeButton })}
        {tdedInputs}
      </tr>
    )
  })

const renderTable = props =>
  <table className={props.styles.table}>
    <thead>
      {renderTableHeader(props)}
    </thead>
    <tbody>
      {renderItems(props)}
    </tbody>
  </table>

export const InputArrayTable = (props) =>
  <>
    {renderTable(props)}
    {/* {renderLectures({})} */}
  </>
