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
    <>
     <form onSubmit={handleSubmit}>
  


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
        placeholder="currentPassword"
        value={formData.password}
        onChange={handleChange}
        required
      autoComplete='false'
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
        disabled={isLoggingIn}
        style={{ minWidth: "200px" }}
      >
        {isLoggingIn ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Login"
        )}
      </button>
    </form>
      <div>
          Don't have an account? <Link to="/signup">Signup</Link>
      </div>


  </>   
  )
}

export default Login