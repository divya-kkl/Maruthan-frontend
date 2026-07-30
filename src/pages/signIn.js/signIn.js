import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk, registerUserThunk, resetAuthError, resetRegistrationSuccess, togglePasswordVisibility } from '../../redux/Slice/userSlice';
import './signIn.css';
import eyeOpenIcon from '../../assets/icons/eye-open.svg';
import eyeClosedIcon from '../../assets/icons/eye-closed.svg';

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
                  <img src={eyeClosedIcon} alt="Hide password" style={{ width: '20px', height: '20px' }} />
                ) : (
                  <img src={eyeOpenIcon} alt="Show password" style={{ width: '20px', height: '20px' }} />
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