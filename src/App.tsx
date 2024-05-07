import React from 'react';
import logo from './logo.svg';
import './App.css';
import CountryList from './components/countryList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CountryList />
      </header>
    </div>
  );
}

export default App;
