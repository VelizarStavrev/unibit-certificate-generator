// Styles
import './App.scss';

// Libraries and hooks
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import mainClass from './contexts/mainClassContext';
import isLogged from './contexts/isLoggedContext';

// Route guards
import RequireAuth from './guards/RequireAuth';

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
import Profile from './components/Profile/Profile';

// Pages - Account Related
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Reset from './components/Reset/Reset';

// Pages - Logged in
import Certificates from './components/Dashboard/Certificates/Certificates';
import Templates from './components/Dashboard/Templates/Templates';
import Template from './components/Template/Template';
import TemplateView from './components/Template/TemplateView/TemplateView';

function App() {
  const checkIfLogged = localStorage.getItem('token') ? true : false;
  const [logged, setLogged] = useState(checkIfLogged);
  const loggedValue = { logged, setLogged };
  
  const [currentClass, setClass] = useState(mainClass);
  const classValue = { currentClass, setClass };

  return (
    <div className='App'>
      <isLogged.Provider value={loggedValue}>
        <Header />

        <mainClass.Provider value={classValue}>
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
                <Route path='/dashboard/template/' element={<Navigate to='/dashboard/template/new' />} />
                <Route path='/template/' element={<Navigate to='/dashboard/template/new' />} />
                <Route path='/template/new' element={<Navigate to='/dashboard/template/new' />} />
                <Route path='/template/:id' element={<Navigate to='/dashboard/template/:id' />} />
                <Route path='/template/edit/:id' element={<Navigate to='/dashboard/template/edit/:id' />} />
                <Route element={<RequireAuth />}>
                  <Route path='/dashboard/certificates' element={<Certificates />} />
                  <Route path='/dashboard/templates' element={<Templates />} />
                  <Route path='/dashboard/template/new' element={<Template templateType='new' />} />
                  <Route path='/dashboard/template/:templateId' element={<TemplateView />} />
                  <Route path='/dashboard/template/edit/:templateId' element={<Template templateType='edit' />} />
                  <Route path='/profile' element={<Profile />} />
                </Route>

                {/* <Route path='*' element={<404 />} /> */}
              </Routes>
          </main>
        </mainClass.Provider>
      
        <Footer />
      </isLogged.Provider>
    </div>
  );
}

export default App;
