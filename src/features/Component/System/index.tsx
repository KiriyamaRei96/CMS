import React, { memo } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import { v4 as uuid } from "uuid";

import { Tabs } from "antd";
import Language from "./component/Language";
export interface SystemProps {}

const System = memo((props: SystemProps) => {
  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>Quản lý hệ thống</h3>
      </div>
      <div className={clsx(style.tabWraper)}>
        <Tabs
          items={[
            {
              label: <span>Ngôn ngữ</span>,
              key: "ngôn ngữ",
              children: <Language />,
            },
          ]}
        ></Tabs>
      </div>
    </div>
  );
});
export default System;
