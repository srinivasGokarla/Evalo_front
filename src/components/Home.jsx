import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const HomePage = () => {
  const[token,setToken] = useState('')
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allImage, setAllImage] = useState(null);
  const navigation = useNavigate();

  useEffect(() => {
    getImage();
  }, []);

  const submitImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const result = await axios.post("https://evallo-hlrz.onrender.com/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(result);
    
    } catch (error) {
      console.error("Error uploading image:", error);
      
    }
  };

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getImage = async () => {
    try {
      const result = await axios.get("https://evallo-hlrz.onrender.com/get-image");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      
    }
  };

  const handleLogout = async () => {
    if (localStorage.getItem('authToken') !== null) {
      const response = await fetch('https://evallo-hlrz.onrender.com/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        localStorage.removeItem('authToken');
        localStorage.clear();
        console.log('Successfully logged out',token)
        navigation('/');
      } else {
        console.error('Logout failed');
      }
    }
  };
  

  useEffect(() => {
    const checkToken = () => {
      let homeCheck = window.location.href.split("/");
      if (localStorage.getItem('authToken') === null && homeCheck[3] === "dashboard") {
        navigation('/');
      } else if (localStorage.getItem("authToken")) {
        const decodedToken = jwtDecode(localStorage.getItem("authToken"));
        const expirationTime = decodedToken.exp * 1000; 
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
          console.log('Token has expired');
          localStorage.removeItem('authToken');
          navigation('/');
        } else {
          setToken(localStorage.getItem("authToken"));
        }
      }
    };

    checkToken();
  }, [navigation]);
  


  return (
    <div className="container" >
      <h1>Welcome to HomePage</h1>
      <button onClick={handleLogout}>Logout</button>
     
      <form onSubmit={submitImage} className='upload'>
        <input type="file" accept="image/*" onChange={onInputChange} />
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div className="image-container">
      {allImage == null
        ? ""
        : allImage.map((data) => (
            <div key={data._id}>
              <img src={require(`../images/${data.image}`)} height={100} width={100} alt={data.title} />
              <p>Title: {data.title}</p>
              <p>Description: {data.description}</p>
            </div>
          ))}
          </div>
    </div>
  );
};

export default HomePage;

