import React from "react"
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <Header />
      <p>This will be the search page yipee</p>
      <p>{!data ? "Loading..." : data}</p>
    </div>
  );
}

export default App;
