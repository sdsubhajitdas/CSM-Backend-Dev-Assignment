import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="login" Component={Login} />
        <Route path="register" Component={Register} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
