import { notification } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";
const openNotificationWithIcon = (
  type: NotificationType,
  message: string,
  description: string
) => {
  notification[type]({
    message,
    description,
  });
};
export default openNotificationWithIcon;
