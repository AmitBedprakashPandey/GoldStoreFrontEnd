import { useEffect } from "react";
import imgs from "../asstes/jewellery-background-4608-x-2592-0kq8mwdpc8xkyqna.webp";
function HomePage(params) {
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => (document.body.style.overflowY = "scroll");
  }, []);

  return (
    <>
      <img src={imgs} className="w-screen h-screen -mt-5" />
    </>
  );
}
export default HomePage;
