
import './App.css';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/auth/Login';
import BookList from './components/books/BookList';
import ErrorWrapper from "./components/errors/ErrorWrapper";
import BookDetails from './components/books/BookDetails';
import CreateBookForm from "./components/books/CreateBookForm";
import EditBookForm from "./components/books/EditBookForm";
import BookCopyList from "./components/copies/CopyList";
import CopyDetails from "./components/copies/CopyDetails";
import CreateCopyForm from "./components/copies/CreateCopyForm";
import EditCopyForm from "./components/copies/EditCopyForm";
import OrderList from "./components/orders/OrderList";
import OrderCreateForm from "./components/orders/OrderCreateFrom";
import PrivateRoute from "./PrivateRoute";
import OrderDetails from './components/orders/OrderDetails';
import OrderEditForm from "./components/orders/OrderEditForm";
import UserDetails from "./components/users/UserDetails";
import UserEditForm from "./components/users/UserEditForm";
import RegistrationForm from "./components/auth/RegistrationForm";
function App() {
  return (
      <Router>
          <Routes>
              <Route path="/error" element={<ErrorWrapper />} />
              <Route path="/" element={<Navigate to="/library" />} />
              <Route path="/library" element={<Home />} />
              <Route path="/library/login" element={<Login />} />
              <Route path="/library/registration" element={<RegistrationForm />} />
              <Route path="/library/books" element={
                  <PrivateRoute><BookList /></PrivateRoute>
              } />
              <Route path="/library/books/:id" element={
                  <PrivateRoute><BookDetails /></PrivateRoute>
              } />
              <Route path="/library/books/create" element={
                  <PrivateRoute><CreateBookForm /></PrivateRoute>
              } />
              <Route path="/library/books/:id/edit" element={
                  <PrivateRoute><EditBookForm /></PrivateRoute>
              } />

              <Route path="/library/copies" element={
                  <PrivateRoute><BookCopyList /></PrivateRoute>
              } />
              <Route path="/library/copies/:id" element={
                  <PrivateRoute><CopyDetails /></PrivateRoute>
              } />
              <Route path="/library/copies/create" element={
                  <PrivateRoute><CreateCopyForm /></PrivateRoute>
              } />
              <Route path="/library/copies/:id/edit" element={
                  <PrivateRoute><EditCopyForm /></PrivateRoute>
              } />

              <Route path="/library/orders" element={
                  <PrivateRoute><OrderList /></PrivateRoute>
              } />

              <Route path="/library/orders/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />

              <Route path="/library/orders/create" element={
                  <PrivateRoute> <OrderCreateForm /> </PrivateRoute>
              } />

              <Route path="/library/orders/:id/edit" element={
                  <PrivateRoute> <OrderEditForm /> </PrivateRoute>
              } />

              <Route path="/library/users/:id" element={
                  <PrivateRoute><UserDetails /></PrivateRoute>
              } />

              <Route path="/library/users/:id/edit" element={
                  <PrivateRoute> <UserEditForm /> </PrivateRoute>
              } />
          </Routes>
      </Router>
  );
}

export default App;
