import { Container } from 'react-bootstrap';
import './App.scss';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { handleRefreshRedux } from './redux/actions/userAction';

function App() {

  const dispatch = useDispatch();
  // const { user, loginContext } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(handleRefreshRedux())
    }
  }, [])

  return (
    <>
      <div className='app-container'>
        <Header />
        <Container>
          <AppRoutes />
        </Container>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>

  );
}

export default App;
