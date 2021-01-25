import React from "react";

const Meme = (props) => {
  return (
    <div className="meme">
      <h1>{props.text}</h1>
    </div>
  );
};

export default Meme;
