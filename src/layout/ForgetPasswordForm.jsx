import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, messageClear } from "../Store/Slice/AuthSlice";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";

export default function ForgetPasswordForm() {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector((state) => state.Auth);
  const [passstatus, setPassStatus] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitForm = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setPassStatus(false);
      return;
    }
    setErrorMessage("");
    setPassStatus(true);
    // Clear error if passwords match
    dispatch(forgetPassword({ email: username, pass: password }));
  };

  useEffect(()=>{
    if(message){
      setModelOpen(true)
    }else{
      setModelOpen(false)
    }
  },[message])

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="border py-4 px-5 w-96 bg-white rounded-lg shadow-slate-700 shadow">
      
        <div className="flex justify-center py-3 font-bold">
          Forget Password 
        </div>
        <div className="grid">
          <label>Enter Username</label>
          <input
            className="px-3 border border-slate-300 rounded-md py-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="grid mt-4">
          <label>Enter New Password</label>
          <Password
          feedback={false}
          toggleMask={true}
            type="password"
            className="px-3 border border-slate-300 rounded-md py-3"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            required
          />
        </div>
        <div className="grid mt-4">
          <label>Re-enter Password</label>
          <input
            type="password"
            className="px-3 border border-slate-300 rounded-md py-3"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage("");
            }}
            required
          />
        </div>
        {errorMessage && (
          <div className="text-red-600 mt-2 text-center">{errorMessage}</div>
        )}
        {error && (
          <div className="text-red-600 mt-2 text-center">{error}</div>
        )}
        {modelOpen &&         
        <div className="absolute bg-black/50 top-0 bottom-0 left-0 right-0 z-40">
           <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow shadow-black z-50 p-5 rounded-lg">

           <div className="font-bold text-center">
                Password Changed Successfully
           </div>
           <div className="w-full flex justify-end mt-5">
              <Button label="OK" onClick={()=>{setModelOpen(false) ; dispatch(messageClear()) }} className="bg-blue-500 p-2 text-white" />
            </div>
        </div>
        </div>
        }
        <div className="flex justify-center py-3">
          <Button
            loading={loading}
            disabled={username && password && confirmPassword ? false : true}
            onClick={submitForm}
            className="bg-blue-700 text-white px-14 py-3 rounded-md font-bold shadow hover:shadow-slate-600 duration-300"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
