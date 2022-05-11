import React from 'react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <main className='Missing'>
      <h2>Content not found</h2>
      <p>Well that is so disappointing</p>
      <p>
        <Link to='/'>Visit Our Home Page</Link>
      </p>
    </main>
  )
}

export default Missing