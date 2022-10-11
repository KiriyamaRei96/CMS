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
        mode='inline'
        defaultSelectedKeys={["/"]}
        defaultOpenKeys={["/"]}
        // selectable
        // selectedKeys={[location.pathname]}
        items={[
          {
            key: "/",
            title: "Báo cáo - thống kê",
            icon: <i className='fa-solid fa-chart-simple'></i>,
            label: <Link to='/'>Báo cáo - thống kê</Link>,
          },
          {
            key: uuid(),
            title: "Quản trị người dùng",
            icon: <i className='fa-solid fa-users-gear'></i>,
            label: <span>Quản trị người dùng</span>,
            children: [
              {
                key: "/UserManage/UserList",
                title: "Danh sách người dùng",
                label: (
                  <Link to='/UserManage/UserList'>Danh sách người dùng</Link>
                ),
              },
              {
                key: uuid(),
                title: "Danh sách nhóm quyền",
                label: <span>Danh sách nhóm quyền</span>,
              },
              {
                key: uuid(),
                title: "Danh sách chức năng",
                label: <span>Danh sách chức năng</span>,
              },
            ],
          },
          {
            key: uuid(),
            title: "Quản lý nội dung",
            icon: <i className='fa-solid fa-folder'></i>,
            label: <span>Quản lý nội dung</span>,
            children: [
              {
                key: uuid(),
                title: "Quản lý thành phố",
                label: <span>Quản lý thành phố</span>,
              },
              {
                key: uuid(),
                title: "Quản lý địa điểm",
                label: <span>Quản lý địa điểm</span>,
              },
              {
                key: uuid(),
                title: "Quản lý dịch vụ du lịch (Quản lý lịch trình)",
                label: <span>Quản lý dịch vụ du lịch</span>,
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
            icon: <i className='fa-solid fa-gear'></i>,
            label: <span>Quản lý chung</span>,
            children: [
              {
                key: uuid(),
                title: "Quản lý ngôn ngữ",
                label: <span>Quản lý ngôn ngữ</span>,
              },
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
            icon: <i className='fa-regular fa-user'></i>,
            label: <Link to='/UserInfo'>thông tin cá nhân</Link>,
          },
        ]}
      ></Menu>
    </div>
  );
});

export default SideBar;
