import React from 'react'

const NewPost = ({
   postTitle, postBody, setPostTitle, setPostBody, handleSubmit
}) => {
  return (
    <main className='NewPost'>
      <h2>NewPost</h2>
      <form className='newPostForm' onSubmit={handleSubmit}>
        <lable htmlFor="postForm">Title: </lable>
        <input 
          type="text" 
          id="postForm"
          onChange={(e) => setPostTitle(e.target.value)}
          value={postTitle}  
        required/>

        <lable htmlFor="postBody">Post: </lable>
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