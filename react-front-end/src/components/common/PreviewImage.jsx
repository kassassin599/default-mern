import React from "react";

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = React.useState(null);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // console.log(file, "file in onLoad");
    if (!file) {
      // console.log("inside !file");
      setPreview(null);
    } else if (
      !file.name.match(/\.(jpg|jpeg|png|svg|svg+xml|JPG|JPEG|PNG|SVG|SVG+XML)$/)
    ) {
      // console.log("inside not-match");
      setPreview(null);
    } else {
      // console.log("inside setFile");
      setPreview(reader.result);
    }
  };
  return (
    <div>
      {preview && (
        <img
          src={preview}
          alt="preview"
          width="150px"
          height="auto"
          style={{ borderRadius: "5px" }}
        />
      )}
    </div>
  );
};

export default PreviewImage;
