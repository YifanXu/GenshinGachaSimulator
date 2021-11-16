import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

import SideNav from './SideNav'

import Home from './pages/Home.js';
import About from './pages/About.js';

const sideNavItems = {
  'Home': '/',
//  'About': '/About'
}

function App() {
  return (
    <div id="AppPage">
      <div id="topbar">
        <a href="/">Gacha Addiction Simulator</a>
      </div>
      <SideNav items={sideNavItems}/>
      <Router id="content">
        <Route exact={true} path="/" component={Home}/>
        <Route exact={true} path="/About" component={About}/>
      </Router>
    </div>
  );
}

export default App;
