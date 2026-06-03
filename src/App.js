
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { WOW } from 'wowjs';
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import MainLayout from './Layouts/MainLayout/MainLayout.jsx';
import Home from './pages/Home/Home.jsx';
import Product from './components/Product/Product.jsx';
import Products from './components/Products/Products.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Register from './components/Register/Register.jsx';
import Login from './components/Login/Login.jsx';
import StoreContextprovider from './context/StoreContext.jsx'
import Cart from './components/Cart/Cart.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import Wishlist from './components/Wishlist/Wishlist.jsx';
import AllOrders from './components/AllOrders/AllOrders.jsx';
import ErrorPage from './components/ErrorPage/ErrorPage.jsx';
import OrderConfirmed from './components/OrderConfirmed/OrderConfirmed.jsx';
import SettingsLayout from './Layouts/SettingsLayout/SettingsLayout.jsx';
import Settings from './components/Settings/Settings.jsx';
import SpacificOrderDetails from './components/SpacificOrderDetails/SpacificOrderDetails.jsx';
import AllAddresses from './components/AllAddresses/AllAddresses.jsx';
import AddAddress from './components/AddAddress/AddAddress.jsx';
import { BrowserRouter } from "react-router-dom";

function App() {
  let routes = createBrowserRouter(
    [
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'products',
          element: <Products />
        }, {
          path: 'products-details/:productId',
          element: <ProductDetails />
        }, {
          path: 'register',
          element: <Register />
        }, {
          path: 'login',
          element: <Login />
        }, {
          path: 'cart',
          element: <Cart />,

        }, {
          path: 'wishlist',
          element: <Wishlist />
        }, {
          path: 'checkout',
          element: <Checkout />
        }, {
          path: 'settings',
          element: <SettingsLayout />,
          children: [
            {
              index: true,
              element: <Settings/>
            },
            {
              path: 'settings',
              element: <Settings/>
            },
            {
              path: 'allOrders',
              element: <AllOrders/>
            },{
              path: 'wishList',
              element: <Wishlist/>
            },{
              path: 'allOrders/spacificOrder/:OrderId',
              element: <SpacificOrderDetails/>
            },
            {
              path: 'allAddresses',
              element: <AllAddresses/>
            },
            {
              path: 'allAddresses/addAddress',
              element: <AddAddress/>
            }

          ]
        }, {
          path: 'orderConfirmed/:orderId',
          element: <OrderConfirmed />
        }, {
          path: "*",
          element: <ErrorPage />
        }

      ]

    },
   ] ,
  {
    basename: "/novacart"
  }
  )
  return (
    <StoreContextprovider>
      <RouterProvider router={routes} />
    </StoreContextprovider>
  );
}

export default App;
