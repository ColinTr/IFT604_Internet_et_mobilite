import React from "react";

const TextareaPage = () => {
  return (
    <div className="form-group">
      <textarea
        placeholder="Entrez votre message..."
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="1"
      />
    </div>
  );
};

export default TextareaPage;
