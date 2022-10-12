import React, { memo } from "react";
import clsx from "clsx";
export interface DashBroadProps {}

const DashBroad = memo((props: DashBroadProps) => {
  return <div className={clsx("content")}></div>;
});
export default DashBroad;
