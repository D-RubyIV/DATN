import { Fragment } from "react/jsx-runtime";
import SellBody from "./SellBody";
import SellHeader from "./SellHeader";

const IndexView = () => {
    return (
        <Fragment>
            {/* // header */}
            <SellHeader></SellHeader>
            {/* // body */}
            <SellBody></SellBody>
        </Fragment>
    );
}

export default IndexView;