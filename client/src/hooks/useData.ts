import React from "react";
import axios, { AxiosPromise } from "axios";

// const RELOAD_INTERVAL = 5000;
// const useRefresh = () => {
//   const [reload, setReload] = React.useState(0);
//   React.useEffect(() => {
//     const interval = setInterval(async () => {
//       setReload((prev) => prev + 1);
//     }, RELOAD_INTERVAL);
//   });
//   return reload;
// };

const useData = (
  status: "SUCCESS" | "WAITING" | "UPLOADING" | "FAILED",
  palette: string,
  fileSelected: File | undefined
): [
  data: string[],
  setData: React.Dispatch<React.SetStateAction<string[]>>
] => {
  const [data, setData] = React.useState<string[]>([]);
  const fetchData = (requests: AxiosPromise<any>[]) => {
    let imgUrl: string[] = [];
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          responses.forEach((res) => {
            imgUrl.push(URL.createObjectURL(res.data));
          });
          setData(imgUrl);
        })
      )
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (status === "SUCCESS") {
      if (palette === "both") {
        const req1 = axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/v1/api/image?file=gruvbox_pink_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        });

        const req2 = axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/v1/api/image?file=gruvbox_white_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        });
        fetchData([req1, req2]);
      } else {
        const req = axios({
          url: `${process.env.REACT_APP_UPLOADER_SERVER}/v1/api/image?file=gruvbox_${fileSelected?.name}`,
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "image/*" },
        });
        fetchData([req]);
      }
    }
  }, [fileSelected?.name, palette, status]);
  return [data, setData];
};

export default useData;
