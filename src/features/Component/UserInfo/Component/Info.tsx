import React, { memo } from "react";
import clsx from "clsx";
import style from "../style.module.scss";

import { userInfoSelector } from "../../Login/slice/UserSlice";
import { Skeleton } from "antd";
import { useAppSelector } from "../../../../store/hooks";
export interface InfoProps {}

const Info = memo((props: InfoProps) => {
  const userInfo = useAppSelector(userInfoSelector).info;
  const storeState = useAppSelector(userInfoSelector).storeState;

  return (
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
            Email: <span className={clsx(style.content)}>{userInfo.email}</span>{" "}
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
  );
});
export default Info;
