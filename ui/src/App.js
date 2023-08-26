import Home from "./pages/Home";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import ContextProviders from "./contexts";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

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
              <Route path="/upload" Component={Upload} />
              <Route path="/checkout" Component={Checkout} />
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
      <div className="container mx-auto mt-5">
        <Outlet />
      </div>
    </>
  );
}
