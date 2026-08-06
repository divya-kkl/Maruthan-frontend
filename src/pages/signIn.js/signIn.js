import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk, registerUserThunk, resetAuthError, resetRegistrationSuccess, togglePasswordVisibility, updateAuthField, setAuthFormErrors } from '../../redux/Slice/userSlice';
import { syncCartOnLogin } from '../../redux/Slice/cartSlice';
import './signIn.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = ({ onBack, onSignIn, onGuest }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const dispatch = useDispatch();
  const { loadingAuth: loading, authError: error, registrationSuccess, showPassword, authFormData, authFormErrors } = useSelector(state => state.user);
  const { cartItems } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(resetAuthError());
    dispatch(resetRegistrationSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (registrationSuccess) {
      alert("Registration successful! Please login.");
      setIsRegisterMode(false);
      dispatch(updateAuthField({ name: 'password', value: '' }));
      dispatch(resetRegistrationSuccess());
    }
  }, [registrationSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) dispatch(resetAuthError());

    if (name === 'phone_number') {
      const sanitized = value.replace(/[^0-9]/g, '');
      if (sanitized.length > 10) return;
      dispatch(updateAuthField({ name, value: sanitized }));
      return;
    }
    
    if (name === 'pincode') {
      const sanitized = value.replace(/[^0-9]/g, '');
      dispatch(updateAuthField({ name, value: sanitized }));
      return;
    }

    dispatch(updateAuthField({ name, value }));
  };

  const handleAuth = async () => {
    dispatch(resetAuthError());

    let newErrors = {};

    if (!authFormData.email) newErrors.email = "Email is required";
    if (!authFormData.password) newErrors.password = "Password is required";

    if (isRegisterMode) {
      if (!authFormData.username) newErrors.username = "Username is required";
      if (!authFormData.phone_number || authFormData.phone_number.length !== 10) {
        newErrors.phone_number = "Please enter a valid 10-digit phone number.";
      }
      if (!authFormData.pincode || !/^\d+$/.test(authFormData.pincode)) {
        newErrors.pincode = "Please enter a valid numeric pincode.";
      }
      if (!authFormData.address) newErrors.address = "Address is required";
      if (!authFormData.city) newErrors.city = "City is required";
      if (!authFormData.state) newErrors.state = "State is required";

      if (Object.keys(newErrors).length > 0) {
        dispatch(setAuthFormErrors(newErrors));
        return;
      }
      await dispatch(registerUserThunk(authFormData));
    } else {
      if (Object.keys(newErrors).length > 0) {
        dispatch(setAuthFormErrors(newErrors));
        return;
      }
      const resultAction = await dispatch(loginUserThunk({
        email: authFormData.email,
        password: authFormData.password
      }));

      if (loginUserThunk.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        if (user && user.id) {
          dispatch(syncCartOnLogin({ userId: user.id, localCartItems: cartItems }));
        }
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
              <div style={{ width: '100%' }}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="auth-input"
                  value={authFormData.username}
                  onChange={handleChange}
                  style={authFormErrors.username ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
                />
                {authFormErrors.username && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.username}</div>}
              </div>
            )}

            <div style={{ width: '100%' }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                value={authFormData.email}
                onChange={handleChange}
                style={authFormErrors.email ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
              />
              {authFormErrors.email && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.email}</div>}
            </div>

            <div style={{ position: 'relative', width: '100%', marginBottom: authFormErrors.password ? '5px' : '0' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="auth-input"
                value={authFormData.password}
                onChange={handleChange}
                style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box', ...(authFormErrors.password ? { borderColor: '#e53e3e', marginBottom: '0' } : {}) }}
              />
              <span
                onClick={() => dispatch(togglePasswordVisibility())}
                className="password-eye-icon"
              >
                {!showPassword ? (
                  <FaEyeSlash style={{ width: '20px', height: '20px', color: '#242424ff' }} />
                ) : (
                  <FaEye style={{ width: '20px', height: '20px', color: '#242424ff' }} />
                )}
              </span>
            </div>
            {authFormErrors.password && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px', width: '100%' }}>{authFormErrors.password}</div>}

            {isRegisterMode && (
              <>
                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    className="auth-input"
                    value={authFormData.phone_number}
                    onChange={handleChange}
                    style={authFormErrors.phone_number ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
                  />
                  {authFormErrors.phone_number && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.phone_number}</div>}
                </div>

                <select
                  name="gender"
                  className="auth-input"
                  value={authFormData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>

                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="auth-input"
                    value={authFormData.address}
                    onChange={handleChange}
                    style={authFormErrors.address ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
                  />
                  {authFormErrors.address && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.address}</div>}
                </div>

                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="auth-input"
                    value={authFormData.city}
                    onChange={handleChange}
                    style={authFormErrors.city ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
                  />
                  {authFormErrors.city && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.city}</div>}
                </div>

                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="auth-input"
                    value={authFormData.state}
                    onChange={handleChange}
                    style={authFormErrors.state ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
                  />
                  {authFormErrors.state && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.state}</div>}
                </div>

                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="auth-input"
                  value={authFormData.country}
                  onChange={handleChange}
                />

                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    className="auth-input"
                    value={authFormData.pincode}
                    onChange={handleChange}
                    style={authFormErrors.pincode ? { borderColor: '#e53e3e', marginBottom: '5px' } : {}}
                  />
                  {authFormErrors.pincode && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{authFormErrors.pincode}</div>}
                </div>
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