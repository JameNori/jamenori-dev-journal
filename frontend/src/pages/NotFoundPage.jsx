import { Link } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-8">
          <span className="text-white text-2xl font-bold">!</span>
        </div>

        {/* Error Message */}
        <h1 className="font-poppins text-4xl font-bold text-brown-600 mb-8">
          Page Not Found
        </h1>

        {/* Go Home Button */}
        <Link
          to="/"
          className="bg-brown-600 text-white px-8 py-4 rounded-lg font-poppins font-medium hover:bg-brown-700 transition-colors"
        >
          Go To Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}
