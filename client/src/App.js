import './App.css';

import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import mainClass from './contexts/mainClassContext';

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

import Template from './components/Template/Template';

function App() {
  const [currentClass, setClass] = useState(mainClass);
  const value = { currentClass, setClass };

  return (
    <div className='App'>
      <Header />
      
      <mainClass.Provider value={value}>
        <main className={currentClass}>
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
              <Route path='/certificates' element={<Navigate to='/dashboard/certificates' />} />
              <Route path='/templates' element={<Navigate to='/dashboard/templates' />} />
              <Route path='/dashboard/certificates' element={<Certificates />} />
              <Route path='/dashboard/templates' element={<Templates />} />

              <Route path='/dashboard/template' element={<Template />} />
              <Route path='/template' element={<Navigate to='/dashboard/template' />} />
              
              {/* <Route path='*' element={<404 />} /> */}
            </Routes>
        </main>
      </mainClass.Provider>

      <Footer />
    </div>
  );
}

export default App;
