import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

// import 'index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initialize to false

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser ");
    if (currentUser) {
      setIsAuthenticated(true);
    } else{
      setIsAuthenticated(false); // Set to false if no user is found
    }
  }, [isAuthenticated]);

  const queryClient = new QueryClient();
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar/>
        <div className="flex-grow pt-20"> 
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
           
            
          </Routes>
        </div>
        {/* <Footer />  */}
      </div>
    </Router>
  );
};

export default App;
