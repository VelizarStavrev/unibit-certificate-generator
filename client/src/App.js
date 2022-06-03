import './App.css';

import { Routes, Route } from 'react-router-dom';

// Components
// Shared
import Header from './components/Shared/Header/Header';
import Footer from './components/Shared/Footer/Footer';

// Pages
// Pages - Anonymous and logged in
import Home from './components/Home/Home';

// Pages - Account Related
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Reset from './components/Reset/Reset';

function App() {
  return (
    <div className='App'>
      <Header />
      
      <main>
          <Routes>
            <Route path='/' element={<Home />} />

            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/password-reset' element={<Reset />} />

            {/* <Route path='*' element={<404 />} /> */}
          </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
