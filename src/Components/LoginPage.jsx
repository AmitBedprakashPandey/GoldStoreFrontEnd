import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Store/Slice/AuthSlice";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", pass: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Company } = useSelector((state) => state.Company);
  const { error } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/crm");
    }
  }, [navigate]);

  const formDataHandler = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const loginBtn = useCallback(async () => {
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      const token = localStorage.getItem("token");
      if (token) {
        navigate(Company ? "/crm" : "/company");
      }
    }
  }, [dispatch, formData, navigate, Company]);

  return (
    <div className="bg-sky-50 fixed inset-0 z-50 flex justify-center items-center">
      <div className="bg-white md:w-[400px] w-[350px] shadow-lg rounded-lg px-5 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        </div>

        <div className="mt-5">
          {error && (
            <div className="bg-red-200 border border-red-700 rounded-lg px-4 py-2 text-red-500 font-semibold mb-4">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={formDataHandler}
                autoComplete="email"
                required
                className="w-full rounded-md py-3 px-2 text-gray-900 shadow-md ring-1 ring-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                name="pass"
                type="password"
                value={formData.pass}
                onChange={formDataHandler}
                autoComplete="current-password"
                required
                className="w-full rounded-md py-3 px-2 text-gray-900 shadow-md ring-1 ring-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={loginBtn}
            disabled={!formData.email || !formData.pass}
            className="mt-10 w-full flex justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-indigo-700 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
