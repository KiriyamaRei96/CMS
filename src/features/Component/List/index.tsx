import React, { memo } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import Search from "./Component/Search";
import TableItems from "./Component/Table";

export interface ListProps {}

const List = memo((props: ListProps) => {
  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>Text</h3>
      </div>
      <div className={clsx(style.main, "d-flex")}>
        <Search />
        <TableItems />
      </div>
    </div>
  );
});
export default List;
