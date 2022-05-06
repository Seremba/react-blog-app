import React from 'react'

const NewPost = ({
   postTitle, postBody, setPostTitle, setPostBody, handleSubmit
}) => {
  return (
    <main className='NewPost'>
      <h2>NewPost</h2>
      <form className='newPostForm' onSubmit={handleSubmit}>
        <label htmlFor="postForm">Title: </label>
        <input 
          type="text" 
          id="postForm"
          onChange={(e) => setPostTitle(e.target.value)}
          value={postTitle}  
        required/>

        <label htmlFor="postBody">Post: </label>
        <textarea
          type="text" 
          id="postBody"
          onChange={(e) => setPostBody(e.target.value)}
          value={postBody}  
        required/>
        <button type='submit'>Submit</button>
      </form>
    </main>
  )
}

export default NewPost