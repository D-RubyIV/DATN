import { Fragment } from "react/jsx-runtime";
import Hero from '@/views/client/Hero/Hero'
import Products from '@/views/client/Products/ProductsHung'
import TopProducts from '@/views/client/TopProducts/TopProducts'
import Banner from '@/views/client/Banner/Banner'
import Subscribe from '@/views/client/Subscribe/Subscribe'
import Testimonials from '@/views/client/Testimonials/Testimonials'
import React, { useEffect, useState } from 'react'
import Navbar from '@/views/client/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Footer from "./Footer/Footer";
import Popup from '@/views/client/Popup/Popup'
import ProductDetail from '@/views/client/Cart/ProductDetail'
import CartComponent from '@/views/client/Cart/CartComponent'
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
    const [orderPopup, setOrderPopup] = useState(false);

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };
    useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();
    }, []);
    return (
        <Fragment>
            <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
                <Navbar handleOrderPopup={handleOrderPopup} />
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero handleOrderPopup={handleOrderPopup} />
                            <Products />
                            <TopProducts handleOrderPopup={handleOrderPopup} />
                            <Banner />
                            <Subscribe />
                            <Testimonials />
                        </>
                    } />
                    <Route path="/about" element={<ProductDetail />} /> {/* Định nghĩa route cho trang mới */}
                    <Route path="/cart" element={<CartComponent />} /> {/* Định nghĩa route cho trang mới */}
                </Routes>
                <Footer />
                <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
            </div>
        </Fragment>
    );
}

export default Dashboard;