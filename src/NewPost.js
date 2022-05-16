import React from 'react'
import { useState, useContext } from 'react'
import axios from 'axios'
import { format} from 'date-fns';
import DataContext from './context/DataContext'
import { useNavigate } from "react-router-dom"; 

const NewPost = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const { posts, setPosts } = useContext(DataContext);
  const baseUrl = 'http://localhost:3500/posts';
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const  datetime = format( new Date(), 'MMMM dd, yyy pp') ;   
    const newPost = {id,title: postTitle, datetime, body: postBody }
    try{ 
      const response = await axios.post(baseUrl, newPost)
      const allPosts = [...posts, response.data]
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      navigate("/", {return: true})
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
    
  }

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