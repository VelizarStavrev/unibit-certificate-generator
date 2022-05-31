import './App.css';

import { Routes, Route } from 'react-router-dom';

// Components
// Shared
import Header from './components/Shared/Header/Header';
import Footer from './components/Shared/Footer/Footer';

// Pages
import Home from './components/Home/Home';

function App() {
  return (
    <div className="App">
      <Header />
      
      <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            {/* <Route path="*" element={<404 />} /> */}
          </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
