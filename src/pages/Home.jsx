import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";
import SaveUserToDB from "../components/SaveUserToDB";

const Home = () => {
  return (
    <div className="pt-16 sm:pt-20 overflow-x-hidden max-w-full">
      <Navbar />
      <SaveUserToDB />

      <Hero />
      <JobListing />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
