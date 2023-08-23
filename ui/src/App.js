import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
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
            <Route path="/" Component={Home} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContextProviders>
  );
}

export default App;
