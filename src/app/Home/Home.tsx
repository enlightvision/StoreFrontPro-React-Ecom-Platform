import { useEffect } from "react";
import CarauselSlider from "../Carousel/Carousel";
import Footer from "../Footer/Footer";
import ProductCard from "../ProductCard/ProductCard";

export default function Home({ search }: any) {
  useEffect(() => {
    window.document.title = "Home";
  }, []);
  return (
    <>
      <CarauselSlider />
      <ProductCard search={search} />
      <Footer />
    </>
  );
}
