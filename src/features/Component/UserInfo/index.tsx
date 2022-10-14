import React, { memo } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../Login/slice/UserSlice";
import { Menu } from "antd";

import style from "./style.module.scss";
import { Link, Outlet } from "react-router-dom";
export interface UserInfoProps {}

const UserInfo = memo((props: UserInfoProps) => {
  const userInfo = useSelector(userInfoSelector).info;

  return (
    <div className={clsx(style.userInfo)}>
      <Menu
        defaultSelectedKeys={[
          userInfo?.phone === null ? "update info" : "Info",
        ]}
        mode='inline'
        items={[
          {
            key: "Info",
            title: "Thông tin người dùng",
            label: <Link to='/UserInfo'>Thông tin người dùng </Link>,
          },
          {
            key: "update info",
            title: "Cập nhật thông tin",
            label: <Link to='/UserInfo/updateInfo'>Cập nhật thông tin </Link>,
          },
          {
            key: "change password",
            title: "Thay đổi mật khẩu",
            label: <Link to='/UserInfo/changePass'>Thay đổi mật khẩu </Link>,
          },
        ]}
      ></Menu>
      <Outlet />
    </div>
  );
});
export default UserInfo;
