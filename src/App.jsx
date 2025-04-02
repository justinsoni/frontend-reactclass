import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddTask from './components/Addtask';


function App() {
  return (
    <div className="app">
      <Header />
      <Navbar />
      <main className="main-content">
        <AddTask />
      </main>
      <Footer />
    </div>
  );
}

export default App;