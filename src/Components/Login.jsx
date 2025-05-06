  import React, { useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { useAuth } from '../Context/AuthContext';
  import { toast } from 'react-toastify';

  const Login = () => {
    const { handleLogin } = useAuth();

    const [googleLoading, setGoogleLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
      setFormLoading(true);
      try {
        await handleLogin(data);
      } catch (err) {
        console.error('Login error:', err);
      } finally {
        setFormLoading(false);
      }
    };

    const handleGoogleLogin = async () => {
      setGoogleLoading(true);
      try {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
      } catch (err) {
        toast.error('Failed to initiate Google login. Please try again.');
        setGoogleLoading(false);
      }
    };

    return (

      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl border border-purple-200 ">
        <div className="bg-purple-500 rounded-t-2xl pt-0 px-0">
          <h2 className="text-2xl font-bold text-center text-white py-4">Login</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={formLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={formLoading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={formLoading || googleLoading}
            className={`w-full py-2 rounded-lg text-white transition ${
              formLoading || googleLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            }`}
          >
            {formLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || formLoading}
            className={`w-full py-2 rounded-lg border transition flex items-center justify-center ${
              googleLoading || formLoading
                ? 'bg-gray-100 cursor-not-allowed text-gray-400 border-gray-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            {googleLoading ? 'Connecting...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    );
  };

  export default Login;