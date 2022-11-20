import React, { memo } from "react";
import clsx from "clsx";

import { userInfoSelector } from "../Login/slice/UserSlice";
import { Menu, Skeleton } from "antd";

import style from "./style.module.scss";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
export interface UserInfoProps {}

const UserInfo = memo((props: UserInfoProps) => {
  const userInfo = useAppSelector(userInfoSelector).info;

  const storeState = useAppSelector(userInfoSelector).storeState;
  return (
    <div className={clsx(style.userInfo)}>
      <div className={clsx(style.info, "d-flex")}>
        {storeState === "loading" ? (
          <Skeleton active />
        ) : (
          <>
            <h3>Thông tin cá nhân</h3>
            <span>
              Tên người dùng:
              <span className={clsx(style.content)}>
                {userInfo.firstname} {userInfo.lastname}
              </span>
            </span>
            <span>
              Email:{" "}
              <span className={clsx(style.content)}>{userInfo.email}</span>{" "}
            </span>
            <span>
              Số điện thoại:
              <span className={clsx(style.content)}> {userInfo.phone}</span>
            </span>
            <span>
              Loại tài khoản:
              <span className={clsx(style.content)}> {userInfo.role.name}</span>
            </span>
          </>
        )}
      </div>
      <Menu
        defaultSelectedKeys={[
          userInfo?.phone === null ? "update info" : "Info",
        ]}
        mode="inline"
        items={[
          {
            key: "Info",
            title: "Thông tin người dùng",
            label: <Link to="/UserInfo">Thông tin người dùng </Link>,
          },
          {
            key: "update info",
            title: "Cập nhật thông tin",
            label: <Link to="/UserInfo/updateInfo">Cập nhật thông tin </Link>,
          },
          {
            key: "change password",
            title: "Thay đổi mật khẩu",
            label: <Link to="/UserInfo/changePass">Thay đổi mật khẩu </Link>,
          },
        ]}
      ></Menu>
      <Outlet />
    </div>
  );
});
export default UserInfo;
