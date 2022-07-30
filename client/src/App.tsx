import axios from "axios";
import React from "react";
import "./index.css";

function App() {
  const [fileSelected, setSelectedFile] = React.useState<File>();
  const [uploadSuccess, setUploadSuccess] = React.useState<boolean>(false);
  const [gruvFile, setGruvFile] = React.useState<any>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onFileUpload = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (fileSelected) {
      const formData = new FormData();
      formData.append("uploadImg", fileSelected, fileSelected.name);

      axios
        .post(`${process.env.REACT_APP_UPLOADER_SERVER}/upload`, formData)
        .then((res) => {
          console.log(res);
          setUploadSuccess(true);
          console.log("Upload Success", uploadSuccess);
          alert("File Upload success");
        })
        .catch((err) => {
          alert("File Upload Error");
          console.log(err);
        });
    }

    console.log(fileSelected);
  };

  React.useEffect(() => {
    if (uploadSuccess) {
      axios({
        url: `${process.env.REACT_APP_UPLOADER_SERVER}/image?file=gruvbox_${fileSelected?.name}`,
        method: "GET",
        responseType: "blob",
        headers: { "Content-Type": "image/*" },
      })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setGruvFile(imageUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [uploadSuccess, fileSelected]);

  return (
    <div className="App">
      <div className="container--upload">
        <label htmlFor="photo">
          <input
            accept="image/*"
            // style={{ display: "none" }}
            title="Choose Photo"
            id="uploadImg"
            name="uploadImg"
            type="file"
            multiple={false}
            onChange={onFileChange}
            className="btn btn-filepicker"
          />

          <button className="btn btn-upload" onClick={onFileUpload}>
            Upload
          </button>
        </label>
      </div>
      <div className="container--files">
        {fileSelected && (
          <div>
            <img src={URL.createObjectURL(fileSelected)} alt="Upload" />
          </div>
        )}
        {gruvFile ? (
          <div>
            <img src={gruvFile} alt="Upload" />
            <div className="buttonContainer">
              <a
                download
                href={`${process.env.REACT_APP_UPLOADER_SERVER}/image?file=gruvbox_${fileSelected?.name}`}
              >
                <i className="fa fa-download" />
                download
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
