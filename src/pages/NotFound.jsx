import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { Layout } from "../components/layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. Perhaps you've
            mistyped the URL or the page has been moved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => window.history.back()}
              className="btn-outline flex items-center space-x-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            <Link to="/" className="btn-primary flex items-center space-x-2">
              <FiHome className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
