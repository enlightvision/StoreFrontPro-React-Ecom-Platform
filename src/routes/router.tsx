import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../app/Home/Home";
import Login from "../app/Login/Login";
import Register from "../app/Registration/Registration";
import ProductDetailsScreen from "../app/ProductDetails/ProductDetails";
import Header from "../app/Header/Header";
import { useState } from "react";
import Cart from "../app/Cart/Cart";
import { componentPaths } from "../api/Path";
import Wishlist from "../app/Wishlist/Wishlist";
import Checkout from "../app/Checkout/Checkout";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../hooks/useAuth";
import Payment from "../app/Payment/Payment";
import OrderHistory from "../app/OrderHistory/OrderHistory";
import OrderPlacedSuccessfully from "../app/OrderPlacedSuccessfully/OrderPlacedSuccessfully";
import CartProvider from "../context/CartContext";
import AdminDashboardLayout from "../admin/layout/DashboardLayout";
import AdminLogin from "../admin/component/Login/AdminLogin";
import PageNotFoud from "../app/PagenotFound/PageNotFoud";
import AdminRoutes from "./AdminRoutes";

// type childrenTypes = {
//   path: string;
//   element: any;
// };

export default function Routers() {
  const [search, setSearch] = useState<{ text: string; search: boolean }>({
    text: "",
    search: false,
  });
  const { isAuthenticated } = useAuth();

  const router = [
    {
      path: componentPaths.login,
      element: isAuthenticated ? (
        <Navigate to={componentPaths.home} />
      ) : (
        <Login />
      ),
    },
    {
      path: componentPaths.register,
      element: isAuthenticated ? (
        <Navigate to={componentPaths.home} />
      ) : (
        <Register />
      ),
    },
    {
      path: componentPaths.notFound,
      element: <PageNotFoud />,
    },
    {
      path: componentPaths.home,
      element: <Home search={search} />,
    },
    {
      path: componentPaths.products,
      element: <ProductDetailsScreen />,
    },
    {
      path: componentPaths.cart,
      element: <Cart />,
    },
    {
      path: componentPaths.wishList,
      element: <Wishlist />,
    },
    {
      path: componentPaths.checkOut,
      element: (
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      ),
    },
    {
      path: componentPaths.payment,
      element: (
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      ),
    },
    {
      path: componentPaths.orderHistory,
      element: <OrderHistory />,
    },
    {
      path: componentPaths.orderPlaced,
      element: (
        <ProtectedRoute>
          <OrderPlacedSuccessfully />
        </ProtectedRoute>
      ),
    },
    {
      path: componentPaths.adminLogin,
      element: isAuthenticated ? (
        <Navigate to={componentPaths.adminDashborad} />
      ) : (
        <AdminLogin />
      ),
    },
    {
      path: componentPaths.adminDashborad,
      element: (
        <AdminRoutes>
          <AdminDashboardLayout />
        </AdminRoutes>
      ),
      cheldren: [
        {
          // path: "/admin/login",
          // element: <AdminLogin />,
        },
      ],
    },
  ];

  return (
    <>
      <CartProvider>
        <Header setSearch={setSearch} />
        <Routes>
          {router.map((x, i) =>
            x.cheldren && x.cheldren.length > 0 ? (
              <Route path={x.path} element={x.element} key={i}>
                {x.cheldren.map((children: any) => (
                  <Route
                    path={children.path}
                    element={children.element}
                    key={i + "child"}
                  />
                ))}
              </Route>
            ) : (
              <Route path={x.path} element={x.element} key={i} />
            )
          )}
        </Routes>
      </CartProvider>
    </>
  );
}
