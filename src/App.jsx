import React from 'react';
import Header from './components/header';
import Navbar from './components/navbar';
import Footer from './components/footer';
import AddTask from './components/addtask';


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