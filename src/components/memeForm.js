import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";
import { navigate } from "hookrouter";
import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

function MemeForm(props) {
  const imageRef = useRef(null);
  const [text, setText] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [image, setImage] = useState("");

  const componentConfig = () => {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post",
    };
  };

  const djsConfig = () => {
    return {
      addRemoveLinks: true,
      maxFiles: 1,
    };
  };

  const handleDrop = () => {
    return {
      addedfile: (file) => {
        const formData = new FormData();

        formData.append("upload_preset", "meme-images");
        formData.append("file", file);

        fetch("https://api.cloudinary.com/v1_1/dlupyozsu/image/upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setImage(data.secure_url);
          })
          .catch((err) => console.error(err));
      },
    };
  };

  const editSubmit = () => {
    fetch(`https://mjr-meme-flask-api.herokuapp.com/meme/${props.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text,
        favorite,
      }),
    })
      .then(() => imageRef.current.dropzone.removeAllFiles())
      .then(() => navigate("/"))
      .catch((err) => console.error("PUT Error: ", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (!props.id) {
      case false:
        editSubmit();
        break;
      default:
        axios
          .post("https://mjr-meme-flask-api.herokuapp.com/add-meme", {
            text,
            favorite,
            image,
          })
          .then(() => {
            setText("");
            setImage("");
            setFavorite(false);
            imageRef.current.dropzone.removeAllFiles();
          })
          .catch((err) => {
            console.log("Handle Submit Error: ", err);
          });
    }
  };

  useEffect(() => {
    if (props.id) {
      fetch(`https://mjr-meme-flask-api.herokuapp.com/meme/${props.id}`)
        .then((res) => res.json())
        .then((data) => {
          setText(data.text);
          setFavorite(data.favorite);
        })
        .catch((err) => console.error("Fetch meme error: ", err));
    }
  }, []);

  return (
    <div>
      <h1>{props.id ? "Edit Meme" : "Add a Meme"}</h1>
      <form onSubmit={handleSubmit}>
        <DropzoneComponent
          ref={imageRef}
          config={componentConfig()}
          djsConfig={djsConfig()}
          eventHandlers={handleDrop()}
        >
          Drop that sweet meme yo!
        </DropzoneComponent>
        <input
          type="text"
          placeholder="Enter a caption"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <div>
          <input
            type="checkbox"
            checked={favorite}
            onChange={() => setFavorite(!favorite)}
          ></input>

          <span>Favorite?</span>

          <button type="submit">{props.id ? "Edit Meme" : "Post Meme"}</button>
        </div>
      </form>
    </div>
  );
}

export default MemeForm;
