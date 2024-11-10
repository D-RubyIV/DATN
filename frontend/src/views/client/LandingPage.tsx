import { Fragment, useState } from 'react'
import Products from '@/views/client/Products/ProductsHung'
import TopProducts from '@/views/client/TopProducts/TopProducts'
import Banner from '@/views/client/Banner/Banner'
import Subscribe from '@/views/client/Subscribe/Subscribe'
import Testimonials from '@/views/client/Testimonials/Testimonials'
import Hero from "@/views/client/Hero/Hero";

function LandingPage() {
    const [orderPopup, setOrderPopup] = useState(false);

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };
    return (
        <Fragment>
            <Hero handleOrderPopup={handleOrderPopup} />
            <Products />
            <TopProducts handleOrderPopup={handleOrderPopup} />
            <Banner />
            <Subscribe />
            <Testimonials />
        </Fragment>
    )
}

export default LandingPage