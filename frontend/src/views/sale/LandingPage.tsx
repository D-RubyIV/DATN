import {Fragment} from "react";
import Navbar from "@/views/sale/Navbar";
import ProductList from "@/views/sale/ProductList";
import SaleProvider from "@/views/sale/SaleContext";
import CartDrawer from "@/views/sale/CartDrawer";

const LandingPage = () => {
    return (
        <Fragment>
            <div>
                <SaleProvider>
                    <Navbar></Navbar>
                    <ProductList></ProductList>
                    <CartDrawer></CartDrawer>
                </SaleProvider>
            </div>
        </Fragment>
    )
}
export default LandingPage