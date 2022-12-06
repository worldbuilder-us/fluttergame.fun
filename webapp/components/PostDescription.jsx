import React, { useState } from 'react'

const PostDescription = ({ bContent }) => {
    const [ description, setDescription ] = useState(bContent)
  return (
    <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'>{description}</div>
  )
}

export default PostDescription