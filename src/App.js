import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import EditPost from './EditPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom"; 
import {useState, useEffect} from 'react';
import { format} from 'date-fns';
import axios from 'axios';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';


function App() {
  const [posts, setPosts] = useState([]); 
  const [search, setSearch] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [searchResult, setSearchResults] = useState([]);
  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch('httpp://localhost:3500/posts'); 
 
  const baseUrl = 'http://localhost:3500/posts';
 
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

  let navigate = useNavigate();
  const returnToHome = () => {
     navigate("/", {return: true})
  }

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
      returnToHome();
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
      returnToHome();
    }catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    
    try {
       await axios.delete(`http://localhost:3500/posts/${id}`);
        const postList = posts.filter( post => post.id === id);
        setPosts(postList);
        returnToHome();
      } catch(err) {
        console.log(`Err: ${err.message}`);
      }
  }


  return (
    
    <div className="App">

      <Header title="My Blog" width={width}/>
      <Nav 
       search={search}
       setSearch={setSearch}
      />
      
      <Routes>
      <Route path="/" 
          element={
            <Home 
            posts={searchResult}
            fetchError={fetchError}
            isLoading= {isLoading}
            />} 
        />
          
        <Route path="/post" 
              element={<NewPost
                  postTitle={postTitle}
                  postBody = {postBody}
                  setPostTitle ={setPostTitle}
                  setPostBody ={setPostBody}
                  handleSubmit = {handleSubmit}
              />}
        />

        <Route path="/edit/:id" 
              element={<EditPost
                  posts={posts}
                  editTitle={editTitle}
                  editBody = {editBody}
                  setEditTitle ={setEditTitle}
                  setEditBody ={setEditBody}
                  handleEdit = {handleEdit}
                />}
         />
          
        <Route path="/post/:id"
         element={<PostPage 
          posts={posts}
          handleDelete = {handleDelete}
         />}
         />
          
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      
      <Footer />
      
    </div>
  );
}

export default App;
