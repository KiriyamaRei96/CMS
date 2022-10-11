import { Menu } from "antd";
import React, { memo } from "react";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "./style.module.scss";
import { Link, useLocation } from "react-router-dom";
interface SideBarProps {}

const SideBar = memo((props: SideBarProps) => {
  // const location = useLocation();
  // console.log(location);
  return (
    <div className={clsx(style.sideBar, "d-flex")}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["/"]}
        defaultOpenKeys={["/"]}
        // selectable
        // selectedKeys={[location.pathname]}
        items={[
          {
            key: "/",
            title: "Báo cáo - thống kê",
            icon: <i className="fa-solid fa-chart-simple"></i>,
            label: <Link to="/">Báo cáo - thống kê</Link>,
          },

          {
            key: uuid(),
            title: "Quản lý nội dung",
            icon: <i className="fa-solid fa-folder"></i>,
            label: <span>Quản lý nội dung</span>,
            children: [
              {
                key: uuid(),
                title: "Quản lý thành phố",
                label: (
                  <Link to="ContentManage/CityList">Quản lý thành phố</Link>
                ),
              },
              {
                key: uuid(),
                title: "Quản lý địa điểm",
                label: <span>Quản lý địa điểm</span>,
              },

              {
                key: uuid(),
                title:
                  "Quản lý các tiện ích (địa điểm tiện ích dùng để hiển thị bản đồ)",
                label: <span>Quản lý các tiện ích</span>,
              },
              {
                key: uuid(),
                title: "Quản lý tin tức",
                label: <span>Quản lý tin tức</span>,
              },
              {
                key: uuid(),
                title: "Quản lý sự kiện",
                label: <span>Quản lý sự kiện</span>,
              },
            ],
          },
          {
            key: uuid(),
            title: "Quản lý chung",
            icon: <i className="fa-solid fa-gear"></i>,
            label: <span>Quản lý chung</span>,
            children: [
              {
                key: uuid(),
                title: "Quản lý loại địa điểm",
                label: <span>Quản lý loại địa điểm</span>,
              },
              {
                key: uuid(),
                title: "Quản lý category tin tức",
                label: <span>Quản lý category tin tức</span>,
              },
              {
                key: uuid(),
                title:
                  "Danh mục loại tiện ích (địa điểm tiện ích dùng để hiển thị bản đồ)",
                label: <span>Danh mục loại tiện ích</span>,
              },
            ],
          },
          {
            key: "/UserInfo",
            title: "thông tin cá nhân",
            icon: <i className="fa-regular fa-user"></i>,
            label: <Link to="/UserInfo">thông tin cá nhân</Link>,
          },
        ]}
      ></Menu>
    </div>
  );
});

export default SideBar;
