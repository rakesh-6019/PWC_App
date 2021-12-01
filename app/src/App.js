import logo from "./logo.svg";
import nodejs from "./nodejs.png";
import "./App.css";
import React from "react";
import { Table } from "./containers/table";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            style={{ height: "100px", marginTop: "3rem" }}
          />
          <img
            src={nodejs}
            className="App-logo"
            alt="logo"
            style={{ height: "100px", marginTop: "5rem" }}
          />
        </div>
        <p>
          I hope you find a small table rendering component intruiging!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Users
        </a>
        <Table />
      </header>
    </div>
  );
}

export default App;
