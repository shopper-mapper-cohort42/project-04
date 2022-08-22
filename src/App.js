import './App.css';
import Location from './Location';
import WelcomePage from './WelcomePage';
import Header from './Header';
import { Link, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import homeImage from './assets/home-image.png';
import Results from './Results';
import SearchItems from './SearchItems';

function App() {
    const apiKey = 'SbABP9Vr89Ox8a38s29QPLUQm51xa784';

    return (
        <>
            <div className="App">
                <Header />
                <main id="mainContent">
                    <section className="welcomePageDiv">
                        <Routes>
                            <Route path="/" element={<WelcomePage />} />
                            <Route path="/location" element={<Location apiKey={apiKey} />} />

                            <Route path="/location/:coords" element={<SearchItems apiKey={apiKey} />} />
                            <Route path="/location/:coords/:searchItem" element={<Results apiKey={apiKey} />} />
                        </Routes>
                    </section>
                </main>
            </div>
        </>
    );
}

export default App;
