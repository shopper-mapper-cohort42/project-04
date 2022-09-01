import "./App.css";

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { DarkModeProvider } from "./components/DarkModeContext";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Header />} />
        </Routes>

        <Main />
        {/* mapState={mapState}  */}
        <Footer />
      </div>
    </>
  );
}

export default App;
