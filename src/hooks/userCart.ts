import { useContext } from "react";
import { cartContext } from "../context/CartContext";

const useCart = () => useContext(cartContext);

export default useCart;
