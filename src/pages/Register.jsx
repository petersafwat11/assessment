import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/auth";

const Register = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-auth items-center justify-center p-12">
        <div className="max-w-md text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-bold">M</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Marketplace Today</h2>
          <p className="text-blue-100">
            Create your account and start shopping. Enjoy exclusive deals, fast
            delivery, and a seamless shopping experience.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-blue-200">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-sm text-blue-200">Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm text-blue-200">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};

export default Register;
