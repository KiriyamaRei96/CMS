import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import React, { useState } from "react";
import getCookie from "../../../../Api/getCookie";

export interface GalleriesProps {}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const Galleries = (props: GalleriesProps) => {
  const [fileList, setFileList] = useState<any>([
    {
      uid: "-1",
      name: "image1.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image2.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-3",
      name: "image3.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-4",
      name: "image4.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-5",
      name: "image.png",
      status: "error",
    },
  ]);
  return (
    <Upload
      action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
      headers={{ Authorization: getCookie("token") }}
      listType='picture-card'
      fileList={fileList}
      onChange={({ fileList: newFileList }) => {
        console.log(newFileList);
        setFileList(newFileList);
      }}
    >
      {uploadButton}
    </Upload>
  );
};
export default Galleries;
