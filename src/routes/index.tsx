import Home from "../app/Home/Home";
import Login from "../app/Login/Login";
import Register from "../app/Registration/Registration";
import ProductDetailsScreen from "../app/ProductDetails/ProductDetails";
import { useState } from "react";
import Cart from "../app/Cart/Cart";
import { componentPaths } from "../api/Path";
import Wishlist from "../app/Wishlist/Wishlist";
import AnonymousLayout from "../app/Layout/AnonymousLayout";
import MainLayout from "../app/Layout/MainLayout";
import { renderRoutes } from "./router";
import { getItem } from "../utils/storageService";

export default function App() {
  const [cart, setCart] = useState<any>(getItem("cart", []));

  const [search, setSearch] = useState<{ text: string; search: boolean }>({
    text: "",
    search: false,
  });

  const routes = [
    {
      layout: AnonymousLayout,
      routes: [
        {
          name: "login",
          title: "Login Page",
          isPublic: true,
          path: componentPaths.login,
          component: <Login />,
        },
        {
          name: "register",
          title: "Register Page",
          isPublic: true,
          path: componentPaths.register,
          component: <Register />,
        },
      ],
    },
    {
      layout: MainLayout,
      routes: [
        {
          name: "home",
          title: "Home Page",
          isPublic: true,
          path: componentPaths.home,
          component: <Home search={search} />,
        },
        {
          name: "productDetails",
          title: "ProductDetails Page",
          isPublic: true,
          path: componentPaths.products,
          component: <ProductDetailsScreen setcart={setCart} />,
        },
        {
          name: "cart",
          title: "Shopping Cart Page",
          isPublic: true,
          path: componentPaths.cart,
          component: <Cart cart={cart} setcart={setCart} />,
        },
        {
          name: "wishlist",
          title: "Wishlist Page",
          path: componentPaths.wishList,
          component: <Wishlist cart={cart} setcart={setCart} />,
        },
      ],
    },
  ];

  const Routes = renderRoutes(routes, { cart, setSearch });

  return <Routes isAuthorized={true} />;
}
