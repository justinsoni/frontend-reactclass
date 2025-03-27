import React from 'react';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="#all">All Tasks</a></li>
        <li><a href="#active">Active</a></li>
        <li><a href="#completed">Completed</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
