import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { format} from 'date-fns';
import axios from 'axios';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({children}) => {
  const [posts, setPosts] = useState([]); 
  const [search, setSearch] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [searchResult, setSearchResults] = useState([]);
  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts'); 
 
  
 
 useEffect(() => {
   setPosts(data);
 },[data]);
  /* usage of axios
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(baseUrl);
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          // Not in the 200 response range 
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }

    fetchPosts();
  }, []) */

  useEffect(() => {
    const filteredResults = posts.filter((post) => 
    
    ((post.body).toLowerCase()).includes(search.toLowerCase())
    || //or
    ((post.title).toLowerCase()).includes(search.toLowerCase())
    )
    setSearchResults(filteredResults.reverse());
  }, [posts, search])

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

  const handleEdit = async (id) => {
    const  datetime = format( new Date(), 'MMMM dd, yyy pp') ;   
    const updatedPost = {id,title: editTitle, datetime, body: editBody };

    try {
      const response = await axios.put(`http://localhost:3500/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? {...response.data}: post));
      setEditTitle('');
      setEditBody('');
      navigate("/", {return: true})
    }catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    
    try {
       await axios.delete(`http://localhost:3500/posts/${id}`);
        const postList = posts.filter( post => post.id === id);
        setPosts(postList);
        navigate("/", {return: true})
      } catch(err) {
        console.log(`Err: ${err.message}`);
      }
  }
    return (
        <DataContext.Provider value={{
             search, setSearch,
             searchResult, fetchError, isLoading,
             postTitle, postBody, setPostTitle, setPostBody, handleSubmit,
             posts, handleEdit, editBody, setEditBody, editTitle, setEditTitle,
             handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;