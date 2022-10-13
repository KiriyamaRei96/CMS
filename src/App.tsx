import "./App.scss";
import Header from "./features/Header";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./features/SideBar";
import { useDispatch, useSelector } from "react-redux";
import {
  reLogin,
  userInfoSelector,
} from "./features/Component/Login/slice/UserSlice";
import { useEffect } from "react";
import getCookie from "./Api/getCookie";

function App() {
  const loginState = useSelector(userInfoSelector).isLogin;
  const UserState = useSelector(userInfoSelector).info;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const cookie = getCookie("token");
    console.log(cookie);
    if (cookie === undefined) {
      navigate("/login");
    }
    if (cookie !== undefined) {
      if (!loginState) {
        dispatch(reLogin());
      }
      dispatch({ type: "USER_GETINFO_REQUESTED" });
    }
    // if (!loginState) {
    //   if (cookie === undefined) {
    //     navigate("/login");
    //   }
    //   if (cookie !== "") {
    //     dispatch(reLogin());
    //   }
    // }
    // if (cookie !== "") {
    //
    // }
  }, []);
  useEffect(() => {
    if (UserState?.phone === null) {
      navigate("/UserInfo");
    }
  }, []);
  return (
    <div className="App d-flex">
      <Header></Header>
      <div className="Cotainer ">
        <SideBar></SideBar>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
