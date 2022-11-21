import React, { memo } from "react";
import clsx from "clsx";

import { userInfoSelector } from "../Login/slice/UserSlice";
import { Menu, Skeleton, Tabs } from "antd";

import style from "./style.module.scss";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import avatar from "../../../asset/pngwing.com.png";
import { UpdateInfo } from "./Component/UpdateInfo";
import { ChangePass } from "./Component/ChangePass";
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
            <div className={clsx(style.avatarWrapper)}>
              <img src={avatar} alt='' />
              <h2 className={clsx(style.content)}>
                {userInfo?.firstname} {userInfo?.lastname}
              </h2>
            </div>

            <span>
              Email:{" "}
              <span className={clsx(style.content)}>{userInfo?.email}</span>{" "}
            </span>
            <span>
              Số điện thoại:
              <span className={clsx(style.content)}> {userInfo?.phone}</span>
            </span>
            <span>
              Loại tài khoản:
              <span className={clsx(style.content)}>
                {" "}
                {userInfo?.role?.name}
              </span>
            </span>
          </>
        )}
      </div>
      <Tabs
        className={clsx(style.Tabs)}
        defaultActiveKey='1'
        // onChange={onChange}
        items={[
          {
            label: `Cập nhật thông tin cá nhân`,
            key: "1",
            children: <UpdateInfo />,
          },
          {
            label: `Thay đổi mật khẩu`,
            key: "2",
            children: <ChangePass />,
          },
        ]}
      />
    </div>
  );
});
export default UserInfo;
