import {useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import DataContext from './context/DataContext'
import axios from 'axios'

const PostPage = () => {
  const { posts, setPosts } = useContext(DataContext);
  let navigate = useNavigate();
  const { id } = useParams();
  const post = posts.find(post => (post.id).toString() === id);
   
  const handleDelete = async (id) => {
    
    try {
       await axios.delete(`http://localhost:3500/posts/${id}`);
        const postList = posts.filter( post => post.id === id);
        setPosts(postList);
        navigate("/", {return: true});
      } catch(err) {
        console.log(`Err: ${err.message}`);
      }
  }

  return (
    <main className='PostPage'>
      <article>
        {
          post && <>
                  <h2 >{post.title}</h2>
                  <p className='postDate'>{post.datetime}</p>
                  <p className='postBody'>{post.body}</p>
                  <Link to={`/edit/${post.id}`}>
                    <button className='editButton'>Edit Post</button>
                  </Link>
                  <button className='deleteButton' onClick={() => handleDelete(post.id)}>Delete Post</button>
                  </>
        }

        {
          !post && <>
                      <h2>Post Not Found</h2>
                      <p>Well that is disappointing </p>
                      <p>
                           <Link to='/'>Vist Our Home Page</Link>
                      </p>
                    </>
        }
      </article>
    </main>
  )
}

export default PostPage