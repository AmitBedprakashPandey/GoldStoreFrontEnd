import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Store/Slice/AuthSlice";

export default function LogingPage(params) {
  const [formData, setFormData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Company } = useSelector((state) => state.Company);
  const { error } = useSelector((state) => state.Auth);
  const formDataHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {    
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const loginBtn = async () => {
    dispatch(loginUser(formData)).then(()=>{
      if(localStorage.getItem('token')){
        if(Company){
          navigate("/");
        }else{
          navigate('/company')
        }
      }
    });
  }
  return (
    <div className=" bg-sky-50 absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center">
      <div className="bg-white absolute top-48 md:w-[400px] w-[350px] shadow-gray-400 shadow-lg rounded-lg px-5 py-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="bg-red-200 h-18 px-4 border-red-700 border rounded-lg shadow-slate-400 shadow-sm my-3 py-1.5 text-red-500 font-semibold">
              {error}
            </div>
          )}
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label
                for="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData?.email}
                  onChange={formDataHandler}
                  autocomplete="email"
                  required
                  className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-gray-300 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">            
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="pass"
                  type="password"
                  value={formData?.pass}
                  onChange={formDataHandler}
                  autocomplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-gray-300 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>
          <div>
            <button
              type="submit"
              onClick={loginBtn}
              disabled={formData?.email && formData?.pass ? false : true}
              className="flex w-full justify-center rounded-md bg-indigo-600 disabled:bg-indigo-700 disabled:cursor-not-allowed px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-10"
            >
              Sign in
            </button>
          </div>

          {/* <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
}
