import AppNavbar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = ({ isAuthenticated, user, setIsAuthenticated }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
