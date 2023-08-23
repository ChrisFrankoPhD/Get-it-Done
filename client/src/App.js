// React
import './App.css';
import { Routes, Route, Navigate, } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Components
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import NavBar from './Components/Dashboard/NavBar';
// Toastify Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchText, setSearchText] = useState("")

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  const verifyToken = async () => {
    try {
      const response = await fetch("auth/verify",
        {
          method: "GET",
          headers: { token: localStorage.token}
        });
      const data = await response.json();
      data === true ? (setAuth(true)) : (setAuth(false));

    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Routes>
        <Route 
          exact path="/login" 
          element={
            !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          exact path="/register" 
          element={
            !isAuthenticated ? (
              <Register setAuth={setAuth}/>
            ) : (
              <Navigate to="/" />              
            )
          }
        />
        <Route 
          exact path="/" 
          element={
            isAuthenticated ? (
              <>
                <NavBar setAuth={setAuth} searchText={searchText} setSearchText={setSearchText} />
                <Dashboard setAuth={setAuth} pauseOnFocusLoss={false} searchText={searchText} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }  
          setAuth={setAuth}
        />
      </Routes>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;



