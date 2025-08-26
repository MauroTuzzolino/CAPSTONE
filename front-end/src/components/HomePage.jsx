import AppNavbar from "./NavBar";
import Footer from "./Footer";
import HomeMain from "./HomeMain";

const HomePage = ({ isAuthenticated, user }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <AppNavbar isAuthenticated={isAuthenticated} user={user} />

      {/* Contenuto dinamico principale */}
      <main className="flex-grow-1">
        <HomeMain /> {/* Sezione centrale con news */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
