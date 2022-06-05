import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';

// Components
// Shared
import Header from './components/Shared/Header/Header';
import Footer from './components/Shared/Footer/Footer';

// Pages
// Pages - Anonymous and logged in
import Home from './components/Home/Home';
import Verify from './components/Verify/Verify';
import Documentation from './components/Documentation/Documentation';
import Contacts from './components/Contacts/Contacts';

// Pages - Account Related
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Reset from './components/Reset/Reset';

// Pages - Logged in
import Certificates from './components/Dashboard/Certificates/Certificates';
import Templates from './components/Dashboard/Templates/Templates';

function App() {
  return (
    <div className='App'>
      <Header />
      
      <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/documentation' element={<Documentation />}>
              <Route path=':section' element={<Documentation />}>
                <Route path=':topic' element={<Documentation />} />
              </Route>
            </Route>
            <Route path='/contacts' element={<Contacts />} />

            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/password-reset' element={<Reset />} />

            <Route path='/dashboard' element={<Navigate to='/dashboard/certificates' />} />
            <Route path='/dashboard/certificates' element={<Certificates />} />
            <Route path='/dashboard/templates' element={<Templates />} />

            {/* <Route path='*' element={<404 />} /> */}
          </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
