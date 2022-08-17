import React from "react";
import { useData, useServerStatus } from "../hooks/";
import axios from "axios";
import { Container } from "../components/";

const Main = () => {
  const [fileSelected, setSelectedFile] = React.useState<File>();
  const [status, setStatus] = React.useState<
    "WAITING" | "UPLOADING" | "FAILED" | "SUCCESS"
  >("WAITING");
  // const [gruvFile, setGruvFile] = React.useState<string[]>([]);
  const [palette, setPalette] = React.useState<string>("pink");

  const [data, setData] = useData(status, palette, fileSelected);
  console.log({ data });
  const serverStatus = useServerStatus();

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

    if (serverStatus === "DOWN") {
      return "Server is down please try again later.";
    }

    return "Please select a file to upload";
  };
  return (
    <div className="main">
      <Container className="main--container-upload">
        <div className="main--btnContainer">
          <label htmlFor="file" className="main--btn main--btn-filepicker">
            <input
              accept="image/png, image/jpeg"
              //style={{ display: "none" }}
              title="Choose Photo"
              id="file"
              name="uploadImg"
              type="file"
              multiple={false}
              onChange={onFileChange}
            />
            Browse Files
          </label>
          <div className="main--palettePicker">
            <p>Color Palette</p>
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
        <div className="main--imagePreview">
          {fileSelected && (
            <img src={URL.createObjectURL(fileSelected)} alt="Upload" />
          )}
        </div>
        <div className="main--btnContainer">
          <div>
            <span>Status: {getStatus()}</span>
            {status === "UPLOADING" ? (
              <>
                <i
                  className="fa fa-spinner fa-spin fa-1x fa-fw"
                  style={{ color: "#ebdbb2" }}
                />
              </>
            ) : null}
          </div>
          <button
            className="main--btn main--btn-upload"
            onClick={onFileUpload}
            disabled={!fileSelected || serverStatus === "DOWN"}
          >
            <i className="fa fa-cloud-upload" />
            &nbsp;Upload
          </button>
        </div>
      </Container>

      <div className="main--display">
        {data && data.length > 0
          ? data.map((img, index) => (
              <Container
                className="main--container-files"
                key={`gruv_${index}`}
              >
                <img src={img} alt="Upload" />
                <a
                  className="main--btn-download"
                  download={`gruv_${fileSelected?.name}`}
                  href={img}
                >
                  <i className="fa fa-download" />
                  &nbsp;Download
                </a>
              </Container>
            ))
          : null}
      </div>
    </div>
  );
};

export default Main;
