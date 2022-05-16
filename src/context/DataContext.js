import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { format} from 'date-fns';
import axios from 'axios';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({children}) => {
  const [posts, setPosts] = useState([]); 
  const [search, setSearch] = useState('');
  
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

  
    return (
        <DataContext.Provider value={{
             search, setSearch,
             searchResult, fetchError, isLoading,
             posts, setPosts, handleEdit, editBody, setEditBody, editTitle, setEditTitle,
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;