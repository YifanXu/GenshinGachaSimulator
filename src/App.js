import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

import SideNav from './SideNav'

import Home from './pages/Home.js';
import About from './pages/About.js';

const sideNavItems = {
  'Home': '/GenshinGachaSimulator/',
//  'About': '/About'
}

function App() {
  return (
    <div id="AppPage">
      <div id="topbar">
        <a href="/">Gacha Addiction Simulator</a>
      </div>
      <SideNav items={sideNavItems}/>
      <Home/>
      {/* <Router id="content">
        <Route exact={true} path="/" component={Home}/>
        <Route exact={true} path="/GenshinGachaSimulator/" component={Home}/>
        <Route exact={true} path="/About" component={About}/>
        <Route exact={true} path="/GenshinGachaSimulator/About" component={About}/>
      </Router> */}
    </div>
  );
}

export default App;
