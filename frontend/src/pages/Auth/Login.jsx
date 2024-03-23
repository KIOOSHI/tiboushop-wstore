import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loder";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = location;
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-10 flex justify-center items-flex flex-col items-center justify-center min-h-screen py-6 sm:px-6 lg:px-8 h-full">
      <div className="w-full max-w-md px-4">
        <h1 className="text-2xl font-semibold mb-4 text-center text-purple-500">Login In</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer w-full hover:bg-purple-900"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          {loading && <Loader />}
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-700">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-purple-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
     
    </div>
  );
};

export default Login;
