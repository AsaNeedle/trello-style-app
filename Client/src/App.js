import React, { useState, Component } from 'react';
import Home from './Home.js'
import About from './About.js'
import TestPage from './TestPage.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App(){
  return(
  <Router>
    <Switch>
    <Route path='/TestPage'>
      <TestPage />
    </Route>
    <Route path="/Home">
      <Home />
    </Route>
    <Route path="/about">
      <About />
    </Route>
    </Switch>
  </Router>
  )}
        

        



export default App;
