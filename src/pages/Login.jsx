import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "../components/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-auth items-center justify-center p-12">
        <div className="max-w-md text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-bold">M</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Marketplace</h2>
          <p className="text-blue-100">
            Your one-stop destination for quality products. Sign in to access
            your account, track orders, and enjoy personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
