// import React from 'react'

type headerProps = {
  title: string
}

function header({title}: headerProps) {
  return (
    <div id="header">
      <p>{title}</p>
    </div>
  )
}

export default header