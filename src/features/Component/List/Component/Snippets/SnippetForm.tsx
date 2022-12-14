import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Upload,
} from "antd";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "../../style.module.scss";
import getCookie from "../../../../../Api/getCookie";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { selectData } from "../../../../../store/store";

import typeMap from "./typeMap";
import Cookies from "js-cookie";
import { callApi } from "../../../../../Api/Axios";
import { arch, type } from "os";
import SingleArticle from "./component/SingleArticle";
import SnipAvatar from "./component/Avatar";

import ArticleForm from "./component/ArticleForm";
import { userInfoSelector } from "../../../Login/slice/UserSlice";

export interface SnippetsFormProps {
  snippets: any;
  setIsModalOpen: any;
  setCurrent: any;
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const SnippetsForm = ({
  snippets,
  setIsModalOpen,
  setCurrent,
}: SnippetsFormProps) => {
  const [fileList, setFileList] = useState<any>();
  const [dataList, setDataList] = useState<any>();
  const [update, setUpdate] = useState<any>();

  const [collums, setCollums] = useState<any>([]);
  const [info, setInfo] = useState<any>();
  const parentID = useAppSelector(selectData).parentID;
  const [modalOpen, setModalOpen] = useState<any>();
  const dispatch = useAppDispatch();
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;
  const [form] = Form.useForm();
  const userInfo = useAppSelector(userInfoSelector).info;

  useEffect(() => {
    if (snippets?.key === "SnippetGalleries") {
      if (snippets?.data) {
        setFileList([
          ...snippets?.data?.map((item) => ({
            name: item.name,
            status: "done",
            id: item.id,
            url: item.path,
          })),
        ]);
      }
    }
    if (snippets?.key === "SnippetObject") {
      setCollums([
        {
          title: "Ti??u ????? th??ng tin",
          dataIndex: "title",
          key: uuid(),
          render: (text) => <span>{text}</span>,
        },
        {
          title: "Lo???i th??ng tin",
          dataIndex: "type",
          key: uuid(),
          render: (text) => <span>{typeMap[text]}</span>,
        },
        {
          title: "H??nh ???nh",
          dataIndex: "featureImage",
          key: uuid(),
          render: (img) =>
            img ? (
              <img className={clsx(style.img)} alt='' src={img.path}></img>
            ) : (
              <span>kh??ng c?? h??nh ???nh</span>
            ),
        },
      ]);

      setDataList(snippets.data);
    }
    if (snippets?.key === "SnippetMultiArticle") {
      setCollums([
        {
          title: "Ti??u ????? th??ng tin",
          dataIndex: "title",
          key: uuid(),
          render: (text) => <span>{text ? text : "ch??a c?? th??ng tin"}</span>,
        },

        {
          title: "Ch???c n??ng",
          key: "action",
          render: (_, record) => (
            <div>
              <Popconfirm
                onConfirm={() => {
                  form.setFieldValue(
                    "articles",
                    form
                      .getFieldValue("articles")
                      .filter((item) => item.id !== record.id)
                  );
                  setUpdate(uuid());
                }}
                title='B???n mu???n x??a th??ng tin n??y ?'
                okText='X??a'
                cancelText='H???y'
              >
                <Button size='small'>X??a</Button>
              </Popconfirm>
              <Button
                size='small'
                onClick={() => {
                  setUpdate(record);
                  setModalOpen(true);
                }}
              >
                S???a
              </Button>
            </div>
          ),
        },
      ]);

      setDataList(snippets.data);
    }
    form.setFieldsValue(snippets);
    if (
      form.getFieldValue("articles") &&
      form.getFieldValue("articles").length > 0
    ) {
      form.setFieldValue(
        "articles",
        form.getFieldValue("articles").map((item) => ({ id: uuid(), ...item }))
      );
    }
  }, [snippets?.key, snippets?.data]);
  // console.log(
  //   info?.filter(
  //     (item) =>
  //       !dataList?.some((itm) => {
  //         return itm.id === item.id;
  //       })
  //   )
  // );
  return (
    <>
      <Form
        form={form}
        onFinish={(value) => {
          value["snippet_name"] = snippets?.name;
          value["page_name"] = snippets?.pageName;
          if (!value.title) {
            value.title = snippets?.title;
          }
          if (snippets?.key === "SnippetObject") {
            if (dataList) {
              value.relations = dataList.map((file) => file.id).toString();
            }

            dispatch({
              type: "UPDATE_SNIPPETS_REQUESTED",
              payload: {
                data: { ...value, locale },
                actionApi,
                name: snippets?.pageName,
                locale,
              },
            });
            setIsModalOpen(false);
            setCurrent(false);
          }
          if (snippets?.key === "SnippetGalleries") {
            if (fileList) {
              value.relations = fileList.map((file) => file.id).toString();
            }

            dispatch({
              type: "UPDATE_SNIPPETS_REQUESTED",
              payload: {
                data: { ...value, locale },
                actionApi,
                name: snippets?.pageName,
                locale,
              },
            });
            setIsModalOpen(false);
            setCurrent(false);
          }
          if (snippets?.key === "SnippetSingleArticle") {
            console.log(value.image);
            value.image = value?.image?.id
              ? value?.image?.id
              : value.image?.file.response.data.id;
            dispatch({
              type: "UPDATE_SNIPPETS_REQUESTED",
              payload: {
                data: { ...value, locale },
                actionApi,
                name: snippets?.pageName,
                locale,
              },
            });
            setIsModalOpen(false);
            setCurrent(false);
          }
          if (snippets?.key === "SnippetMultiArticle") {
            value.block = value.articles?.map((item) => ({
              ...item,
              image: item?.image?.id,
            }));

            dispatch({
              type: "UPDATE_SNIPPETS_REQUESTED",
              payload: {
                data: { ...value, locale },
                actionApi,
                name: snippets?.pageName,
                locale,
              },
            });
            setIsModalOpen(false);
            setCurrent(false);
          }
        }}
        className={clsx(style.form)}
        layout='inline'
      >
        <div className={clsx(style.snipHeader, "d-flex")}>
          <Form.Item label={"T??n kh???i d??? li???u"}>
            <span>{snippets?.name}</span>
          </Form.Item>
          <Form.Item label={"T??n trang"}>
            <span>{snippets?.pageName}</span>
          </Form.Item>
          {snippets?.key === "SnippetObject" ? (
            <Form.Item label={"L???a ch???n nh??m th??ng tin"}>
              <Select
                onChange={async (value) => {
                  const res = await callApi
                    .get(
                      `v1/${value.replace(
                        "_",
                        "-"
                      )}/gets?limit=10000&page=1&locale=${locale}&search=`,
                      {
                        headers: { Authorization: Cookies.get("token") },
                      }
                    )
                    .then((response) => response.data)
                    .catch((error) => console.log(error));
                  if (res.status === 1) {
                    setInfo(res.data);
                  }
                }}
                placeholder={"Nh??m th??ng tin"}
              >
                {Object.keys(typeMap)
                  .splice(0, Object.keys(typeMap).length - 1)
                  .map((key) => (
                    <Select.Option value={key} key={uuid()}>
                      {typeMap[key]}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          ) : (
            false
          )}
        </div>
        <div className={clsx(style.titleWraper, "d-flex")}>
          <Form.Item
            className={clsx(style.formDes)}
            name={"title"}
            label={"?????t ti??u ????? cho kh???i"}
          >
            <Input
              placeholder={
                snippets?.title ? snippets?.title : "Ti??u ????? d??? li???u"
              }
              type='text'
            ></Input>
          </Form.Item>
          {snippets?.key === "SnippetSingleArticle" ? (
            <SnipAvatar data={snippets.image} />
          ) : (
            false
          )}
          <Form.Item
            className={clsx(style.formDes)}
            key={uuid()}
            label={"Ti??u ????? ph???"}
            name={"subTitle"}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            className={clsx(style.formDes)}
            key={uuid()}
            label={"Link"}
            name={"link"}
          >
            <Input></Input>
          </Form.Item>
        </div>

        {snippets?.key === "SnippetGalleries" ? (
          <Form.Item
            className={clsx(style.formItem)}
            label={"L???a ch???n h??nh ???nh cho kh???i"}
          >
            <Upload
              disabled={
                userInfo?.role?.id === "2"
                  ? false
                  : !userInfo?.permissions["media.upload"]
              }
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

        {snippets?.key === "SnippetObject" ? (
          <>
            <Form.Item
              className={clsx(style.formItem)}
              label={"Th??ng tin ???? ch???n"}
            >
              <Table
                pagination={{ pageSize: 5 }}
                columns={[
                  ...collums,
                  {
                    title: "Ch???c n??ng",
                    key: "action",
                    render: (_, record) => (
                      <div>
                        <Popconfirm
                          onConfirm={() => {
                            setDataList((prv) =>
                              prv.filter((item) => item.id !== record.id)
                            );
                          }}
                          title='B???n mu???n x??a th??ng tin n??y ?'
                          okText='X??a'
                          cancelText='H???y'
                        >
                          <Button size='small'>X??a</Button>
                        </Popconfirm>
                      </div>
                    ),
                  },
                ]}
                dataSource={dataList}
              ></Table>
            </Form.Item>
            <Form.Item
              className={clsx(style.formItem)}
              label={"L???a ch???n th??ng tin"}
            >
              <Table
                pagination={{ pageSize: 5 }}
                dataSource={info
                  ?.map((item) => {
                    item.key = item.id;
                    return item;
                  })
                  .filter(
                    (item) =>
                      !dataList?.some((itm) => {
                        return itm.id === item.id;
                      })
                  )}
                columns={[
                  ...collums,
                  {
                    title: "Ch???c n??ng",
                    key: "action",
                    render: (_, record) => (
                      <Button
                        size='small'
                        onClick={() => {
                          if (dataList) {
                            const idList = dataList.map((item) => item.id);

                            if (!idList.includes(record.id)) {
                              setDataList((prv) => [record, ...prv]);
                            }
                          }
                          if (!dataList) {
                            setDataList([record]);
                          }
                        }}
                      >
                        Th??m
                      </Button>
                    ),
                  },
                ]}
              ></Table>
            </Form.Item>
          </>
        ) : (
          false
        )}

        {snippets?.key === "SnippetSingleArticle" ? <SingleArticle /> : false}
        {snippets?.key === "SnippetMultiArticle" ? (
          <Form.Item
            className={clsx(style.formItem)}
            key={uuid()}
            label={"Danh s??ch n???i dung"}
            name={"articles"}
          >
            <Table
              columns={collums}
              dataSource={form.getFieldValue("articles")}
              pagination={false}
              rowKey={uuid()}
            ></Table>
            <Button
              onClick={() => {
                setUpdate(undefined);
                setModalOpen(true);
              }}
              className={clsx("d-flex", style.snipFooter)}
            >
              T???o th??ng tin
            </Button>
          </Form.Item>
        ) : (
          false
        )}
        <Form.Item className={clsx(style.submit)}>
          <Button htmlType='submit' type='primary'>
            X??c Nh???n
          </Button>
        </Form.Item>
      </Form>
      <Modal
        destroyOnClose
        width='70vw'
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        footer={false}
        title={"Th??ng Tin"}
      >
        <ArticleForm
          setModalOpen={setModalOpen}
          setArr={form.setFieldValue}
          arr={form.getFieldValue("articles")}
          data={update}
        />
      </Modal>
    </>
  );
};
export default SnippetsForm;
