import "./App.scss";
import Header from "./features/Header";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./features/SideBar";

import {
  reLogin,
  userInfoSelector,
} from "./features/Component/Login/slice/UserSlice";
import { useEffect } from "react";
import getCookie from "./Api/getCookie";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { selectData } from "./store/store";

function App() {
  const loginState = useAppSelector(userInfoSelector).isLogin;
  const UserState = useAppSelector(userInfoSelector).info;
  const parentID = useAppSelector(selectData).parentID;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookie = getCookie("token");

    if (cookie === undefined) {
      navigate("/login");
    }
    if (cookie !== undefined) {
      if (!loginState) {
        dispatch(reLogin());
      }
      dispatch({ type: "USER_GETINFO_REQUESTED" });
    }
  }, []);
  useEffect(() => {
    if (UserState?.phone === null) {
      navigate("/UserInfo");
    }

    dispatch({
      type: "GET_LOCALE_REQUESTED",
    });
  }, [parentID]);
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
