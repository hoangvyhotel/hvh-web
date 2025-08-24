import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import ThemeCustomization from './themes';
import router from 'routes';
import 'index.css';

function App() {
  return (
    <ThemeCustomization>
      <RouterProvider router={router} />
      {/* Toast toàn cục */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeCustomization>
  );
}

export default App;
