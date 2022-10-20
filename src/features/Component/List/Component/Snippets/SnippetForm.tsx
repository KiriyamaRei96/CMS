import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import style from "../../style.module.scss";
import getCookie from "../../../../../Api/getCookie";
import { useAppDispatch } from "../../../../../app/hooks";
export interface SnippetsFormProps {
  snippets: any;
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const SnippetsForm = ({ snippets }: SnippetsFormProps) => {
  const [fileList, setFileList] = useState<any>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (snippets?.key === "SnippetGalleries") {
      setFileList(
        snippets?.data?.map((item) => ({
          name: item.name,
          status: "done",
          id: item.id,
          url: item.path,
        }))
      );
    }
  }, [snippets?.key, snippets?.data]);

  return (
    <Form
      onFinish={(value) => {
        value["snippet_name"] = snippets?.name;
        value["page_name"] = snippets?.pageName;
        if (!value.title) {
          value.title = snippets?.title;
        }
        value.relations = fileList.map((file) => file.id);

        dispatch({ type: "UPDATE_SNIPPETS_REQUESTED", payload: value });
      }}
      className={clsx(style.form)}
    >
      <div>
        <Form.Item label={"Tên khối dữ liệu"}>
          <span>{snippets?.name}</span>
        </Form.Item>
        <Form.Item label={"Tên trang"}>
          <span>{snippets?.pageName}</span>
        </Form.Item>
      </div>
      <Form.Item
        className={clsx(style.formItem)}
        name={"title"}
        label={"Đặt tiêu đề cho khối"}
      >
        <Input
          placeholder={snippets?.title ? snippets?.title : "Tiêu đề dữ liệu"}
          type='text'
        ></Input>
      </Form.Item>

      {snippets?.key === "SnippetGalleries" ? (
        <Form.Item
          className={clsx(style.formItem)}
          label={"Lựa chọn hình ảnh cho khối"}
        >
          <Upload
            action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
            headers={{ Authorization: getCookie("token") }}
            listType='picture-card'
            fileList={fileList}
            onChange={(e) => {
              setFileList(e.fileList);

              if (e?.file?.status === "done") {
                const files = fileList.map((img) => {
                  if (img.uid === e.file.uid) {
                    img.id = e.file.response.data.id;
                    img.status = e.file.status;

                    return img;
                  } else {
                    return img;
                  }
                });
                setFileList(files);
              }
            }}
          >
            {uploadButton}
          </Upload>
        </Form.Item>
      ) : (
        false
      )}

      <Form.Item>
        <Button htmlType='submit' type='primary'>
          Xác Nhận
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SnippetsForm;
