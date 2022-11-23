import { PlusOutlined } from "@ant-design/icons";
import { Form, Upload } from "antd";
import React, { memo, useState } from "react";
import getCookie from "../../../../Api/getCookie";
import style from "../style.module.scss";
import clsx from "clsx";
import { userInfoSelector } from "../../Login/slice/UserSlice";
import { useAppSelector } from "../../../../store/hooks";
export interface GalleriesProps {
  galleri: Array<any>;
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const Galleries = ({ galleri }: GalleriesProps) => {
  const [fileList, setFileList] = useState<any>(
    galleri?.map((data) => ({
      name: data?.name,
      status: "done",
      id: data?.id,
      url: data?.path,
    }))
  );
  const info = useAppSelector(userInfoSelector).info;

  return (
    <Form.Item
      className={clsx(style.formItem)}
      key={"galleries"}
      name={"galleries"}
      label='Thư viện ảnh'
    >
      <Upload
        disabled={
          info?.role?.id === "2" ? false : !info?.permissions["media.upload"]
        }
        action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
        headers={{ Authorization: getCookie("token") }}
        listType='picture-card'
        fileList={fileList}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList);
        }}
      >
        {uploadButton}
      </Upload>
    </Form.Item>
  );
};
export default Galleries;
