import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./Accueil";
import About from "./About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/about/:slug" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
