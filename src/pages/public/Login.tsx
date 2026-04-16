import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/auth";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = "fake-jwt-token-" + Date.now();
      setToken(token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 to-blue-200 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">
          <h1 className="text-4xl font-bold mb-4">YourCompany</h1>
          <p className="text-lg text-indigo-100 text-center">
            Simplifying your workflow with secure and modern solutions.
          </p>

          <div className="mt-6 text-sm text-indigo-200 text-center">
            Trusted by thousands of users worldwide.
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
            >
              Login
            </button>

            {/* Footer */}
            <p className="text-sm text-center text-gray-500">
              Forgot password?{" "}
              <span className="text-indigo-600 cursor-pointer hover:underline">
                Reset here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
