import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import style from "../../../style.module.scss";
import clsx from "clsx";
import { Form, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import getCookie from "../../../../../../Api/getCookie";

export interface SnipAvatarProps {
  data: any | undefined;
  label?: string;
  name?: string;
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const SnipAvatar = ({ data, label, name }: SnipAvatarProps) => {
  const [avatar, setAvatar] = useState<any>();

  useEffect(() => {
    if (data) {
      setAvatar([
        {
          name: data?.name,
          status: "done",
          id: data?.id,
          url: data?.path,
        },
      ]);
    }
  }, [data]);
  return (
    <Form.Item
      className={"formAvatar"}
      key={uuid()}
      label={label ? label : "Ảnh đại diện"}
      name={name ? name : "image"}
    >
      <Upload
        action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
        headers={{ Authorization: getCookie("token") }}
        maxCount={1}
        listType='picture-card'
        fileList={avatar}
        onChange={(e: any) => {
          if (e.file.status === "error") {
            e.file.response = "Tải lên thất bại";
          }
          if (e.fileList.length === 0) {
            setAvatar(undefined);
          }

          if (e.file.status === "done") {
            setAvatar([
              {
                name: e.file.response.data.name,
                status: "done",
                id: e.file.response.data.id,
                url: e.file.response.data.path,
              },
            ]);
          }
        }}
      >
        {!avatar ? uploadButton : false}
      </Upload>
    </Form.Item>
  );
};
export default SnipAvatar;
