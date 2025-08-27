import AppNavbar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = ({ isAuthenticated, user }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar isAuthenticated={isAuthenticated} user={user} />
      <Outlet /> {/* Qui verrà inserita HomePage, Profile, ecc */}
      <Footer />
    </div>
  );
};

export default MainLayout;
