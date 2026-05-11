import { BrowserRouter, Routes, Route } from "react-router-dom";
import TV from "./pages/TV";
import Remote from "./pages/Remote";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tv" element={<TV />} />
        <Route path="/remote/:roomId" element={<Remote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;