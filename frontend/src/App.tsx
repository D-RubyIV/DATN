import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import Theme from '@/components/template/Theme';
import Layout from '@/components/layouts';
import appConfig from '@/configs/app.config';
import './locales';
import { ToastContainer } from 'react-toastify'; // Nhập ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Nhập các kiểu dáng mặc định

const environment = process.env.NODE_ENV;

/**
 * Đặt enableMock(Default false) thành true tại configs/app.config.js
 * Nếu bạn muốn kích hoạt mock api
 */

function App() {
    return (
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Theme>
                    <Layout />
                </Theme>
                <ToastContainer position="top-right" autoClose={1200} />
            </BrowserRouter>
        </PersistGate>
    </Provider>
    
    );
}

export default App;
