import React, { Component } from 'react';
import talan from '../../../src/talan.png' 
import Web3 from 'web3'

function Navbar() {  


  return (
    <div> <nav className="navbar navbar-expand-lg navbar-light bg-light flex-md-nowrap shadow">
    <a
      className="navbar-brand col-sm-3 col-md-2 mr-0"
      href="http://www.talan.com"
      target="_blank"
      rel="noopener noreferrer"
    > 
    
<img src={talan} alt='' width="80" height="30"/>
    &nbsp; &nbsp; NFTs Game
    </a>
    
  </nav></div>
  )
}

export default Navbar