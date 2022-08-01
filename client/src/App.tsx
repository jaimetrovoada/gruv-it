import axios from "axios";
import React from "react";
import "./index.css";

function App() {
  const [fileSelected, setSelectedFile] = React.useState<File>();
  const [uploadSuccess, setUploadSuccess] = React.useState<boolean>();
  const [gruvFile, setGruvFile] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [palette, setPalette] = React.useState<string>("pink");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadSuccess(undefined);
    setGruvFile([]);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setUploadSuccess(undefined);
    setGruvFile([]);
    setPalette(e.target.value);
  };

  const onFileUpload = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (fileSelected) {
      const formData = new FormData();
      formData.append("uploadImg", fileSelected, fileSelected.name);
      setIsLoading(true);

      axios
        .post(
          `${process.env.REACT_APP_UPLOADER_SERVER}/upload?palette=${palette}`,
          formData
        )
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
      if (palette === "both") {
        const req1 = axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/image?file=gruvbox_pink_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        });

        const req2 = axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/image?file=gruvbox_white_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        });
        axios
          .all([req1, req2])
          .then(
            axios.spread((...responses) => {
              const responseOne = responses[0];
              const responseTwo = responses[1];
              // use/access the results
              const imageUrlOne = URL.createObjectURL(responseOne.data);
              const imageUrlTwo = URL.createObjectURL(responseTwo.data);
              setGruvFile([imageUrlOne, imageUrlTwo]);
            })
          )
          .catch((err) => {
            console.log(err);
          });
        /*   axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/image?file=gruvbox_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        })
          .then((response) => {
            const imageUrl = URL.createObjectURL(response.data);
            setGruvFile([imageUrl]);
          })
          .catch((err) => {
            console.log(err);
          }); */
      } else {
        axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/image?file=gruvbox_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        })
          .then((response) => {
            const imageUrl = URL.createObjectURL(response.data);
            setGruvFile([imageUrl]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [fileSelected?.name, palette, uploadSuccess]);

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
  console.log({ palette });

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
        </label>
        <select name="palette" id="palette" onChange={handlePaletteChange}>
          <option value="pink" selected>
            Pink/Panther
          </option>
          <option value="white">White/Snoopy</option>
          <option value="both">Both</option>
        </select>
        <button className="btn btn-upload" onClick={onFileUpload}>
          <i className="fa fa-upload" />
          Upload
        </button>
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
        {gruvFile && gruvFile.length > 0 ? (
          palette === "both" ? (
            <>
              <div>
                <img src={gruvFile[0]} alt="Upload" />
                <a
                  className="buttonContainer"
                  download={`gruv_${fileSelected?.name}`}
                  href={gruvFile[0]}
                >
                  <i className="fa fa-download" />
                  &nbsp;Download
                </a>
              </div>
              <div>
                <img src={gruvFile[1]} alt="Upload" />
                <a
                  className="buttonContainer"
                  download={`gruv_${fileSelected?.name}`}
                  href={gruvFile[1]}
                >
                  <i className="fa fa-download" />
                  &nbsp;Download
                </a>
              </div>
            </>
          ) : (
            <div>
              <img src={gruvFile[0]} alt="Upload" />
              <a
                className="buttonContainer"
                download={`gruv_${fileSelected?.name}`}
                href={gruvFile[0]}
              >
                <i className="fa fa-download" />
                &nbsp;Download
              </a>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

export default App;
