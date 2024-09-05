import { Navigate } from "react-router-dom";
import { componentPaths } from "../api/Path";
import { getItem } from "../utils/storageService";

const AdminRoutes = ({ children }: any) => {
  const isAuthorized = getItem("user", {});

  return isAuthorized && isAuthorized.isAdmin ? (
    children
  ) : (
    <Navigate to={componentPaths.login} />
  );
};

export default AdminRoutes;
