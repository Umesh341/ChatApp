import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const  [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {

    if (!formData.email || !formData.password || !formData.confirmPassword) {
     toast.error("All fields are required");
      return false;
    }

     if(formData.password.length < 6){
      toast.error("Password must be at least 6 characters long");
      return false;
     }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  }

  const handleSubmit =(e) => {
    e.preventDefault();
    const validate = validateForm();
    if(validate){
      signup(formData);
    }
  }

  const { isSigningUp, signup } = useAuthStore();
  return (
    <>
     <form onSubmit={handleSubmit}>
      <input type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <br />

      <div>
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword((prev) => !prev)}
        />
        <label htmlFor="showPassword">Show Password</label>
      </div>
      <br />

      <button
        className="btn btn-outline"
        type="submit"
        disabled={isSigningUp}
        style={{ minWidth: "200px" }}
      >
        {isSigningUp ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
      <div>
        Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
      </div>


  </>   
  )
}

export default Signup;