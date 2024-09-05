import { createContext, PropsWithChildren, useState } from "react";
import { getItem } from "../utils/storageService";

type cartContextType = {
  cart: { productId: string; quantity: number }[];
  setcart: (cart: []) => void;
};

const initialContextValue: cartContextType = {
  cart: [],
  setcart: () => {},
};

export const cartContext = createContext(initialContextValue);

const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setcart] = useState(getItem("cart", []));

  return (
    <cartContext.Provider value={{ cart, setcart }}>
      {children}
    </cartContext.Provider>
  );
};

export default CartProvider;
