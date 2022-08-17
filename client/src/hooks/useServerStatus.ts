import React from "react";
import axios, { AxiosResponse } from "axios";

interface Status extends AxiosResponse {
  data: {
    status: string;
  };
}
const RELOAD_INTERVAL = 5000;
const useRefresh = () => {
  const [reload, setReload] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(async () => {
      setReload((prev) => prev + 1);
    }, RELOAD_INTERVAL);
    return () => clearInterval(interval);
  });
  return reload;
};

const useServerStatus = (): "UP" | "DOWN" => {
  const [status, setStatus] = React.useState<"UP" | "DOWN">("UP");
  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_UPLOADER_SERVER}/v1/api/status`)
      .then((res: Status) => {
        const serverStatus = res.data;
        if (serverStatus.status === "up") {
          setStatus("UP");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("DOWN");
      });
  };
  const refresh = useRefresh();
  React.useEffect(() => {
    fetchData();
  }, [status, refresh]);
  return status;
};

export default useServerStatus;
