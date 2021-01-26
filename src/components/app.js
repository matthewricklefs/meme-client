import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "hookrouter";
import Meme from "./meme";

const App = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    fetch("https://mjr-meme-flask-api.herokuapp.com/memes")
      .then((res) => res.json())
      .then((data) => setMemes(data))
      .catch((err) => console.error("Fetch Memes error: ", err));
  }, []);

  const deleteMeme = (id) => {
    axios
      .delete(`https://mjr-meme-flask-api.herokuapp.com/delete-meme/${id}`)
      .then((res) => console.log(res.data))
      .then(() => setMemes(memes.filter((meme) => meme.id !== id)))
      .catch((err) => console.error("Delete Meme Error: ", err));
  };

  const editMeme = (id) => {
    navigate(`/form/${id}`);
  };

  const renderMemes = () => {
    return memes.map((meme) => {
      console.log(meme);
      return (
        <Meme
          key={meme.id}
          {...meme}
          deleteMeme={deleteMeme}
          editMeme={editMeme}
        />
      );
    });
  };
  return <div className="app">{renderMemes()}</div>;
};

export default App;
