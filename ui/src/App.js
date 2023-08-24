import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ContextProviders from "./contexts";

function App() {
  return (
    <ContextProviders>
      <BrowserRouter>
        <Routes>
          <Route path="login" Component={Login} />
          <Route path="register" Component={Register} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<Screen />}>
              <Route path="/" Component={Home} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ContextProviders>
  );
}

export default App;

function Screen() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
}
