import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

const MainLayout = ({ cart, setSearch }: any) => {
  return (
    <>
      <Header setSearch={setSearch} cart={cart} />
      <Outlet />
    </>
  );
};

export default MainLayout;
