import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";
import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

function MemeForm(props) {
  const imageRef = useRef(null)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div>
      <h1>Add a Meme</h1>
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

          <button type="submit"> Post Meme</button>
        </div>
      </form>
    </div>
  );
}

export default MemeForm;
