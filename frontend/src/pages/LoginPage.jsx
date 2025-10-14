import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Login = () => {
  const { isLoggingIn, login,signup } = useAuthStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  }); 

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {

    if (!formData.email || !formData.password ) {
     toast.error("All fields are required");
      return false;
    }

     if(formData.password.length < 6){
      toast.error("Password must be at least 6 characters long");
      return false;
     }

    return true;
  }

  const handleSubmit =(e) => {
    e.preventDefault();
     const validate = validateForm();
    if(validate){
      login(formData);
    } 

  }


  return (
  <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      {/* Outer container (2-column layout on large screens) */}
      <div className="flex flex-col lg:flex-row bg-white  rounded-none overflow-hidden w-full max-w-6xl mx-4 ">

        {/* Left side — image (only visible on large screens) */}
        <div className="hidden lg:flex lg:w-2/5 items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-8xl font-extrabold text-green-600 tracking-tight p-10">
              Chat App
            </h1>
            <p className="text-gray-600 text-2xl font-medium">
              Connect with Friends
            </p>
          </div>

        </div>

        {/* Right side — form card */}

        <div className="flex flex-col justify-center items-center p-6 md:p-10 w-full  lg:w-2/5 border border-green-600 max-w-88 mx-auto">
          <div className="w-full max-w-md">
            <div className="mb-5 text-center">
              <h1 className="text-2xl font-semibold text-green-700">Login to your account</h1>
              <p className="text-sm text-gray-500">
                Enter your credentials to access the Chat app
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4"
              noValidate
            >
              {/* Email */}
              <div>
                <label className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-label="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="sr-only">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-green-300 text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 hover:bg-gray-100"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col items-center">
                <button
                  className="w-full px-4 py-2 text-base text-green-700 hover:text-white hover:bg-green-600 transition focus:ring-2 focus:ring-green-200 border border-green-600 rounded-none cursor-pointer"
                  type="submit"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <svg className="w-4 h-4 animate-spin mr-2 inline" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : null}
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            {/* Footer area */}
            <div className="mt-5 text-center text-sm">
              <span>Don't have an account? </span>
              <Link to="/signup" className="text-green-600 font-medium hover:underline">
                Signup</Link>
            </div>
          </div>
        </div>
      </div>
    </div> 
  )
}

export default Login