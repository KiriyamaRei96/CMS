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
            key: uuid(),
            icon: <i className='fa-solid fa-gauge'></i>,
            title: "Tổng quan",
            label: <Link to='/'>Tổng quan</Link>,
          },
          {
            key: "Báo cáo - thống kê",
            title: "Báo cáo - thống kê",
            icon: <i className='fa-solid fa-chart-simple'></i>,
            label: <span>Báo cáo - thống kê</span>,
            children: [
              {
                key: uuid(),
                title: "Thống kê các đơn vị kinh doanh trên địa bàn",
                label: (
                  <Link to='Statistic/businessUnit'>
                    Thống kê các đơn vị kinh doanh
                  </Link>
                ),
              },
              {
                key: uuid(),
                title: "Thống kê thông tin địa điểm",
                label: (
                  <Link to='Statistic/placeInfo'>
                    Thống kê thông tin địa điểm
                  </Link>
                ),
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
                label: (
                  <Link to='ContentManage/CityList'>Quản lý thành phố</Link>
                ),
              },
              {
                key: uuid(),
                title: "Quản lý địa điểm",
                label: (
                  <Link to='ContentManage/placeList'>Quản lý địa điểm</Link>
                ),
              },

              {
                key: uuid(),
                title:
                  "Quản lý các tiện ích (địa điểm tiện ích dùng để hiển thị bản đồ)",
                label: (
                  <Link to='ContentManage/utilities'>Quản lý các tiện ích</Link>
                ),
              },
              {
                key: uuid(),
                title: "Quản lý tin tức",
                label: <Link to='ContentManage/news'>Quản lý tin tức</Link>,
              },
              {
                key: uuid(),
                title: "Quản lý sự kiện",
                label: <Link to='ContentManage/events'>Quản lý sự kiện</Link>,
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
                title: "Quản lý loại địa điểm",
                label: <Link to='Manage/placeType'>Quản lý loại địa điểm</Link>,
              },
              {
                key: uuid(),
                title: "Quản lý category tin tức",
                label: (
                  <Link to='Manage/newsCategory'>Quản lý category tin tức</Link>
                ),
              },
              {
                key: uuid(),
                title:
                  "Danh mục loại tiện ích (địa điểm tiện ích dùng để hiển thị bản đồ)",
                label: (
                  <Link to='Manage/utilitiesType'>Danh mục loại tiện ích</Link>
                ),
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
