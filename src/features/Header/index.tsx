import React, { memo } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import { Dropdown, Menu } from "antd";
import { v4 as uuid } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userInfoSelector } from "../Component/Login/slice/UserSlice";

export interface HeaderProps {}
function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
const Header = memo((props: HeaderProps) => {
  const userInfo = useSelector(userInfoSelector).info;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = (
    <Menu
      items={[
        {
          key: uuid(),
          title: "Thông tin cá nhân",
          label: <Link to='/UserInfo'>thông tin cá nhân</Link>,
          icon: <i className='fa-regular fa-user'></i>,
        },

        {
          key: uuid(),
          onClick: () => {
            delete_cookie("token");

            dispatch({
              type: "USER_LOGOUT_REQUESTED",
              payload: {},
            });
            navigate("login");
          },
          title: "Đăng xuất",
          label: <span>Đăng xuất</span>,
          icon: <i className='fa-solid fa-right-from-bracket'></i>,
        },
      ]}
    ></Menu>
  );
  return (
    <div className={clsx(style.header, "align-items-center")}>
      <Link to='/'>
        <h1>CMS</h1>
      </Link>

      <Dropdown overlay={menu} placement='bottom'>
        <div className={clsx(style.info, "align-items-center")}>
          <i className='fa-regular fa-user'></i>
          <span>
            {userInfo
              ? `${userInfo.firstname} ${userInfo.lastname}`
              : "user name"}
          </span>
        </div>
      </Dropdown>
    </div>
  );
});
export default Header;
