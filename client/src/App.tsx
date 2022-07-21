import axios from "axios";
import React from "react";

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
        .post("http://localhost:8080/upload", formData)
        .then((res) => {
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
        url: `http://localhost:8080/image?file=${fileSelected?.name}`,
        method: "GET",
        responseType: "arraybuffer",
      })
        .then((response) => {
          console.log(response);
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setGruvFile(`data:;base64,${base64}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [uploadSuccess, fileSelected]);

  return (
    <div className="App">
      <label htmlFor="photo">
        <input
          accept="image/*"
          // style={{ display: "none" }}
          id="uploadImg"
          name="uploadImg"
          type="file"
          multiple={false}
          onChange={onFileChange}
        />

        <button onClick={onFileUpload}>Choose Picture</button>
      </label>
      <div>
        {fileSelected && (
          <img src={URL.createObjectURL(fileSelected)} alt="Upload" />
        )}
      </div>
      <div>
        {gruvFile ? (
          <>
            <img src={gruvFile} alt="Upload" />
            <a
              download
              href={`http://localhost:8080/image?file=gruvbox_${fileSelected?.name}`}
            >
              <i className="fa fa-download" />
              download
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
