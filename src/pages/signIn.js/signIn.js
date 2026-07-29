import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk, registerUserThunk, resetAuthError, setAuthError, resetRegistrationSuccess, togglePasswordVisibility } from '../../redux/Slice/userSlice';
import './signIn.css';

const SignIn = ({ onBack, onSignIn, onGuest }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  const dispatch = useDispatch();
  const { loadingAuth: loading, authError: error, registrationSuccess, showPassword } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(resetAuthError());
    dispatch(resetRegistrationSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (registrationSuccess) {
      alert("Registration successful! Please login.");
      setIsRegisterMode(false);
      setFormData(prev => ({ ...prev, password: '' }));
      dispatch(resetRegistrationSuccess());
    }
  }, [registrationSuccess, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(resetAuthError());
  };

  const handleAuth = async () => {
    dispatch(resetAuthError());

    if (isRegisterMode) {
      await dispatch(registerUserThunk(formData));
    } else {
      const resultAction = await dispatch(loginUserThunk({
        email: formData.email,
        password: formData.password
      }));

      if (loginUserThunk.fulfilled.match(resultAction)) {
        onSignIn();
      } else if (resultAction.payload && resultAction.payload.includes("Invalid email or password")) {
         alert("Invalid email or password. If you don't have an account, please register a new one.");
      }
    }
  };

  return (
    <div className="signin-page">


      <div className="signin-container">
        <div className="signin-content">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h2>

          <div className="auth-inputs-wrapper" style={{ maxHeight: isRegisterMode ? '60vh' : 'auto', overflowY: isRegisterMode ? 'auto' : 'visible' }}>

            {isRegisterMode && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="auth-input"
                value={formData.username}
                onChange={handleChange}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
            />

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
              />
              <span
                onClick={() => dispatch(togglePasswordVisibility())}
                className="password-eye-icon"
              >
                {!showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </span>
            </div>

            {isRegisterMode && (
              <>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                  className="auth-input"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
                <select
                  name="gender"
                  className="auth-input"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ backgroundColor: 'white' }}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="auth-input"
                  value={formData.address}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="auth-input"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  className="auth-input"
                  value={formData.state}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="auth-input"
                  value={formData.country}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  className="auth-input"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          {error && <p className="error-message" style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

          <button className="primary-btn" onClick={handleAuth} disabled={loading} style={{ marginTop: '15px' }}>
            {loading ? (isRegisterMode ? 'Registering...' : 'Signing in...') : (isRegisterMode ? 'Register' : 'Sign In')}
          </button>

          {/* <button className="guest-btn" onClick={onGuest} disabled={loading}>Continue as guest</button> */}

          <p style={{ textAlign: 'center', marginTop: '5px', fontSize: '14px', color: '#666' }}>
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                dispatch(resetAuthError());
              }}
              style={{ cursor: 'pointer', color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              {isRegisterMode ? "Sign In" : "Register here"}
            </span>
          </p>

          {/* {!isRegisterMode && (
            <label className="checkbox-wrapper" style={{ marginTop: '20px' }}>
              <input type="checkbox" defaultChecked />
              <span className="checkmark">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              Email me with news and offers
            </label>
          )} */}

          {/* <p className="terms" style={{ marginTop: '20px' }}>
            By continuing, you agree to our <a href="/terms">Terms of service</a>
          </p> */}
        </div>
      </div>

      {/* <div className="signin-footer">
        <a href="/privacy">Privacy policy</a>
      </div> */}
    </div>
  );
};

export default SignIn;