import React, { memo } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import { Dropdown, Menu } from "antd";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";

export interface HeaderProps {}

const Header = memo((props: HeaderProps) => {
  const menu = (
    <Menu
      items={[
        {
          key: uuid(),
          title: "Thông tin cá nhân",
          label: <Link to="/UserInfo">thông tin cá nhân</Link>,
          icon: <i className="fa-regular fa-user"></i>,
        },

        {
          key: uuid(),
          title: "Đăng xuất",
          label: <span>Đăng xuất</span>,
          icon: <i className="fa-solid fa-right-from-bracket"></i>,
        },
      ]}
    ></Menu>
  );
  return (
    <div className={clsx(style.header, "align-items-center")}>
      <Link to="/">
        <h1>CMS</h1>
      </Link>

      <Dropdown overlay={menu} placement="bottom">
        <div className={clsx(style.info, "align-items-center")}>
          <i className="fa-regular fa-user"></i>
          <span>user name</span>
        </div>
      </Dropdown>
    </div>
  );
});
export default Header;
