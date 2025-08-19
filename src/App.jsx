import { RouterProvider } from 'react-router-dom';

// project imports
import ThemeCustomization from './themes';

import router from 'routes';
import 'index.css';
function App() {
  return (
    <ThemeCustomization>
      <RouterProvider router={router} />
    </ThemeCustomization>
  );
}

export default App;
