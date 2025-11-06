import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Categories from "../pages/Categories/Categories.jsx";
import Products from "../pages/Products/Products.jsx";
import Product from "../pages/Product/Poduct.jsx";
import Sales from "../pages/Sales/Sales.jsx";
import Basket from "../pages/Basket/Basket.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import AddProduct from "../pages/AddProduct/AddProduct.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
