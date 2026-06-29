import React, { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import './signIn.css';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginInput) {
    loginUser(input: $input) {
      user {
        id
        username
        email
        country
        state
        city
        address
        phone_number
        pincode
        gender
      }
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: RegisterInput) {
    registerUser(input: $input) {
      user {
        id
        username
        email
        country
        state
        city
        address
        phone_number
        pincode
        gender
      }
      token
    }
  }
`;

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);

      let mutation;
      let variables;

      if (isRegisterMode) {
        mutation = REGISTER_MUTATION;
        variables = { input: formData };
      } else {
        mutation = LOGIN_MUTATION;
        variables = {
          input: {
            email: formData.email,
            password: formData.password
          }
        };
      }

      const data = await client.request(mutation, variables);

      const token = isRegisterMode ? data?.registerUser?.token : data?.loginUser?.token;
      const user = isRegisterMode ? data?.registerUser?.user : data?.loginUser?.user;

      if (token) {
        if (isRegisterMode) {
          // Registration successful: switch to login mode and pre-fill email
          alert("Registration successful! Please login.");
          setIsRegisterMode(false);
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          // Login successful: save token and navigate
          localStorage.setItem('token', token);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          onSignIn();
        }
      } else {
        setError(new Error(isRegisterMode ? "Registration failed. No token received." : "Login failed. No token received."));
      }
    } catch (e) {
      console.error("Auth Error:", e);

      let errorMessage = "Authentication failed. Please try again.";
      if (e.response && e.response.errors && e.response.errors.length > 0) {
        errorMessage = e.response.errors[0].message;
      } else if (e.message) {
        errorMessage = e.message;
      }

      // If it's the specific invalid email error
      if (errorMessage.includes("Invalid email or password")) {
        alert("Invalid email or password. If you don't have an account, please register a new one.");
        errorMessage = "Invalid email or password. Please register.";
      }

      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <img src="/images/log1.png" alt="Logo" className="signin-logo" onClick={onBack} />
      </div>

      <div className="signin-container" style={{ padding: isRegisterMode ? '20px 0' : '0' }}>
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

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
            />

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

          {error && <p className="error-message" style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '15px' }}>{error.message}</p>}

          <button className="primary-btn" onClick={handleAuth} disabled={loading} style={{ marginTop: '15px' }}>
            {loading ? (isRegisterMode ? 'Registering...' : 'Signing in...') : (isRegisterMode ? 'Register' : 'Sign In')}
          </button>

          {/* <button className="guest-btn" onClick={onGuest} disabled={loading}>Continue as guest</button> */}

          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
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