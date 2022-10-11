import React, { memo } from "react";
import clsx from "clsx";
export interface UserInfoProps {}

const UserInfo = memo((props: UserInfoProps) => {
  return <div className={clsx("content")}></div>;
});
export default UserInfo;
