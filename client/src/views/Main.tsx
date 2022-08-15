import React from "react";
import { useData } from "../hooks/";
import axios from "axios";

const Main = () => {
  const [fileSelected, setSelectedFile] = React.useState<File>();
  const [status, setStatus] = React.useState<
    "WAITING" | "UPLOADING" | "FAILED" | "SUCCESS"
  >("WAITING");
  // const [gruvFile, setGruvFile] = React.useState<string[]>([]);
  const [palette, setPalette] = React.useState<string>("pink");

  const [data, setData] = useData(status, palette, fileSelected);
  console.log({ data });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus("WAITING");
    setData([]);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setStatus("WAITING");
    setData([]);
    setPalette(e.target.value);
  };

  const onFileUpload = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (fileSelected) {
      const formData = new FormData();
      formData.append("uploadImg", fileSelected, fileSelected.name);
      setStatus("UPLOADING");

      axios
        .post(
          `${process.env.REACT_APP_UPLOADER_SERVER}/v1/api/upload?palette=${palette}`,
          formData,
          {
            headers: {
              "Content-Type": `multipart/form-data; `,
            },
            timeout: 30000,
          }
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
    <div className="main">
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
        {data && data.length > 0
          ? // eslint-disable-next-line array-callback-return
            data.map((img, index) => (
              <div key={`gruv_${index}`}>
                <img src={img} alt="Upload" />
                <a
                  className="buttonContainer"
                  download={`gruv_${fileSelected?.name}`}
                  href={img}
                >
                  <i className="fa fa-download" />
                  &nbsp;Download
                </a>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Main;
