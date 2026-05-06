import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from './auth/AdminRoute';

const Home         = React.lazy(() => import('./core/Home'));
const Shop         = React.lazy(() => import('./core/Shop'));
const Product      = React.lazy(() => import('./core/Product'));
const Cart         = React.lazy(() => import('./core/Cart'));
const Checkout     = React.lazy(() => import('./core/Checkout'));
const SignUp       = React.lazy(() => import('./user/SignUp'));
const SignIn       = React.lazy(() => import('./user/SignIn'));

const UserDashboard   = React.lazy(() => import('./user/UserDashboard'));
const AdminDashboard  = React.lazy(() => import('./user/AdminDashboard'));
const UserProfile     = React.lazy(() => import('./user/UserProfile'));
const PurchaseHistory = React.lazy(() => import('./user/PurchaseHistory'));

const AddCategory    = React.lazy(() => import('./admin/AddCategory'));
const AddProduct     = React.lazy(() => import('./admin/AddProduct'));
const Orders         = React.lazy(() => import('./admin/Orders'));
const ManageProducts = React.lazy(() => import('./admin/ManageProducts'));
const UpdateProduct  = React.lazy(() => import('./admin/UpdateProduct'));

const RouteList = () => {
    return (
        <Router>
            <Suspense fallback={null}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path='/user/dashboard'   element={<UserDashboard />} />
                        <Route path='/profile/:userId'  element={<UserProfile />} />
                        <Route path='/purchase-history' element={<PurchaseHistory />} />
                    </Route>

                    <Route element={<AdminRoute />}>
                        <Route path='/admin/dashboard'                 element={<AdminDashboard />} />
                        <Route path='/create/category'                 element={<AddCategory />} />
                        <Route path='/create/product'                  element={<AddProduct />} />
                        <Route path='/admin/orders'                    element={<Orders />} />
                        <Route path='/admin/products'                  element={<ManageProducts />} />
                        <Route path='/admin/product/update/:productId' element={<UpdateProduct />} />
                    </Route>

                    <Route path="/"                   element={<Home />} />
                    <Route path="/signin"             element={<SignIn />} />
                    <Route path="/signup"             element={<SignUp />} />
                    <Route path="/shop"               element={<Shop />} />
                    <Route path="/product/:productId" element={<Product />} />
                    <Route path="/cart"               element={<Cart />} />
                    <Route path="/checkout"           element={<Checkout />} />
                </Routes>
            </Suspense>
        </Router>
    )
}

export default RouteList;
