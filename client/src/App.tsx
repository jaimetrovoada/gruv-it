import axios from "axios";
import React from "react";
import "./index.css";

function App() {
  const [fileSelected, setSelectedFile] = React.useState<File>();
  const [status, setStatus] = React.useState<
    "WAITING" | "UPLOADING" | "FAILED" | "SUCCESS"
  >("WAITING");
  const [gruvFile, setGruvFile] = React.useState<string[]>([]);
  const [palette, setPalette] = React.useState<string>("pink");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus("WAITING");
    setGruvFile([]);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setStatus("WAITING");
    setGruvFile([]);
    setPalette(e.target.value);
  };

  const onFileUpload = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (fileSelected) {
      const formData = new FormData();
      formData.append("uploadImg", fileSelected, fileSelected.name);
      setStatus("UPLOADING");

      axios
        .post(
          `${process.env.REACT_APP_UPLOADER_SERVER}/upload?palette=${palette}`,
          formData
        )
        .then((res) => {
          console.log(res);
          setStatus("SUCCESS");
        })
        .catch((err) => {
          console.log(err);
          setStatus("FAILED");
        });
    }
  };

  React.useEffect(() => {
    if (status === "SUCCESS") {
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
  }, [fileSelected?.name, palette, status]);

  const getStatus = (): string => {
    if (fileSelected && status === "WAITING") {
      return "Click upload";
    }
    if (status === "UPLOADING") {
      return "Uploading...";
    }
    if (status === "SUCCESS") {
      return "Uploaded successfully";
    }

    if (status === "FAILED") {
      return "Couldn't upload your file, please try again.";
    }

    return "Please select a file to upload";
  };

  return (
    <div className="App">
      <div className="container--upload">
        <div className="btn--container">
          <label htmlFor="file" className="file">
            <input
              accept="image/png, image/jpeg"
              //style={{ display: "none" }}
              title="Choose Photo"
              id="file"
              name="uploadImg"
              type="file"
              multiple={false}
              onChange={onFileChange}
              className="btn btn-filepicker"
            />
            Browse Files
          </label>
          <div>
            <span>Color Palette</span>
            <select
              name="palette"
              id="palette"
              onChange={handlePaletteChange}
              value={palette}
            >
              <option value="pink">Pink/Panther</option>
              <option value="white">White/Snoopy</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div className="imageViewer">
          {fileSelected && (
            <img src={URL.createObjectURL(fileSelected)} alt="Upload" />
          )}
        </div>
        <div className="uploadBtnContainer">
          <button
            className="btn btn-upload"
            onClick={onFileUpload}
            disabled={!fileSelected}
          >
            <i className="fa fa-cloud-upload" />
            Upload
          </button>
          <div className="statusContainer">
            <span>Status: {getStatus()}</span>
            {status === "UPLOADING" ? (
              <>
                <i
                  className="fa fa-spinner fa-spin fa-3x fa-fw"
                  style={{ color: "#ebdbb2" }}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container--files">
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
