import axios from "axios";
import React from "react";
import "./index.css";

function App() {
  const [fileSelected, setSelectedFile] = React.useState<File>();
  const [uploadSuccess, setUploadSuccess] = React.useState<boolean>();
  const [gruvFile, setGruvFile] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadSuccess(undefined);
    setGruvFile(undefined);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onFileUpload = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (fileSelected) {
      const formData = new FormData();
      formData.append("uploadImg", fileSelected, fileSelected.name);
      setIsLoading(true);

      axios
        .post(`${process.env.REACT_APP_UPLOADER_SERVER}/upload`, formData)
        .then((res) => {
          console.log(res);
          setUploadSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          setUploadSuccess(false);
        })
        .finally(() => setIsLoading(false));
    }

    console.log(fileSelected);
  };

  console.log("Upload Success", uploadSuccess);
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
  }, [fileSelected?.name, uploadSuccess]);

  console.log({ isLoading });
  const getStatus = (): string => {
    if (fileSelected && isLoading === false && uploadSuccess !== true) {
      return "Click upload";
    }
    if (isLoading === true) {
      return "Uploading...";
    }
    if (isLoading === false && uploadSuccess === true) {
      return "Uploaded successfully";
    }

    if (isLoading === false && uploadSuccess === false) {
      return "Couldn't upload your file, please try again.";
    }

    return "Please select a file to upload";
  };
  console.log({ gruvFile });

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
            <i className="fa fa-upload" />
            Upload
          </button>
        </label>
        <span>Status: {getStatus()}</span>
        {isLoading ? (
          <>
            <i
              className="fa fa-spinner fa-spin fa-3x fa-fw"
              style={{ color: "#ebdbb2" }}
            />
          </>
        ) : null}
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
            <a
              className="buttonContainer"
              download={`gruv_${fileSelected?.name}`}
              href={gruvFile}
            >
              <i className="fa fa-download" />
              &nbsp;Download
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
