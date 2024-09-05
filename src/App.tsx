import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Routers from "./routes/router";
import { useEffect } from "react";
import { getItem, setItem } from "./utils/storageService";
import { useLocation } from "react-router-dom";

function App() {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();

  useEffect(() => {
    storeUserDetails();
  }, [query]);

  const storeUserDetails = () => {
    const isExist = getItem("user", {});
    if (!isExist || !isExist._id) {
      const user = query.get("user");
      const accessToken = query.get("accessToken");
      const refreshToken = query.get("refreshToken");
      if (user && accessToken && refreshToken) {
        const parsedUser = JSON.parse(decodeURIComponent(user));
        setItem("user", parsedUser);
        setItem("accessToken", accessToken);
        setItem("refreshToken", refreshToken);
      }
    }
  };

  return (
    <>
      <Routers />
    </>
  );
}

export default App;
