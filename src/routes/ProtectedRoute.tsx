import { Navigate } from "react-router-dom";
import { componentPaths } from "../api/Path";
import { getItem } from "../utils/storageService";

const ProtectedRoute = ({ children }: any) => {
  const isAuthorized = getItem("accessToken", "");
  const isPublic = "";

  return isPublic || (isAuthorized && isAuthorized != "") ? (
    children
  ) : (
    <Navigate to={componentPaths.login} />
  );
};

export default ProtectedRoute;
