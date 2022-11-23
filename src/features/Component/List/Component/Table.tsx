import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Skeleton,
  Steps,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { memo, ReactElement, useEffect, useState } from "react";
import { Table } from "antd";
import { selectData } from "../../../../store/store";

import { infoObj, setLocate } from "../slice/slice";
import style from "../style.module.scss";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import CreateForm from "./Form";
import Cookies from "js-cookie";
import { callApi } from "../../../../Api/Axios";
import { info } from "console";
import Create from "./Create";
import { userInfoSelector } from "../../Login/slice/UserSlice";
export interface TableProps {
  columns: any;
  typeOption?: Array<ReactElement>;
}
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const TableItems = memo(({ typeOption, columns }: TableProps) => {
  const dataItem: infoObj | any = useAppSelector(selectData).infoArray;
  const actionApi = useAppSelector(selectData).actionApi;
  const pagination = useAppSelector(selectData).pagination;
  const locale = useAppSelector(selectData).locale;
  const storeState = useAppSelector(selectData).storeState;
  const info = useAppSelector(userInfoSelector).info;

  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  const [ID, setID] = useState<string | number>();

  const [data, setData] = useState<any>();
  const permiss = actionApi?.replace("v1/", "").replace("/", ".");
  useEffect(() => {
    dataItem[dataItem.findIndex((obj) => obj.id === ID)]
      ? setData(dataItem[dataItem.findIndex((obj) => obj.id === ID)])
      : setData(dataItem[dataItem.findIndex((obj) => obj.name === ID)]);
  }, [ID, dataItem]);

  return (
    <>
      <div className={clsx(style.wraper, "d-flex")}>
        <div className={clsx(style.function, "d-flex")}>
          <Button
            disabled={
              info?.role?.id === "2"
                ? false
                : !info?.permissions[permiss + ".create"]
            }
            onClick={() => {
              setCreateModal(true);
            }}
            type='primary'
          >
            Thêm thông tin
          </Button>
        </div>
        {storeState !== "loading" ? (
          <Table
            className={clsx(style.table)}
            pagination={false}
            columns={[
              ...columns,
              {
                title: "Chức năng",
                key: "action",
                fixed: "right",
                render: (_, record) => (
                  <div key={uuid()}>
                    <Popconfirm
                      onConfirm={() => {
                        dispatch({
                          type: "DELETE_REQUESTED",
                          payload: {
                            id: record.id ? record.id : record.name,
                            name: record?.name,
                            action: actionApi,
                          },
                        });
                      }}
                      title='Bạn muốn xóa thông tin này ?'
                      okText='Xóa'
                      cancelText='Hủy'
                    >
                      <Button
                        disabled={
                          info?.role?.id === "2"
                            ? false
                            : !info?.permissions[permiss + ".delete"]
                        }
                        size='small'
                        key={uuid()}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>

                    <Button
                      disabled={
                        info?.role?.id === "2"
                          ? false
                          : !info?.permissions[permiss + ".update"]
                      }
                      size='small'
                      onClick={() => {
                        dispatch({
                          type: "GET_ROW_REQUESTED",
                          payload: {
                            ID: { id: record.id, name: record.name },
                            action: actionApi,
                            locale,
                          },
                        });
                        setID(record.id ? record.id : record.name);

                        setIsModalOpen(true);
                      }}
                      key={uuid()}
                    >
                      Sửa
                    </Button>
                  </div>
                ),
              },
            ]}
            dataSource={dataItem}
            rowKey={uuid()}
            scroll={{ x: "auto", y: "auto" }}
          />
        ) : (
          <Skeleton active />
        )}

        <Pagination
          showSizeChanger
          current={pagination?.current}
          onChange={(page, pageSize) => {
            dispatch({
              type: "SEARCH_ROW_REQUESTED",
              payload: {
                action: actionApi,
                limit: pageSize,
                page,
                search: "",
                locale,
              },
            });
          }}
          total={pagination?.totalCount}
        />
      </div>
      <Modal
        width='70vw'
        open={isModalOpen}
        onCancel={() => {
          dispatch(setLocate("vi"));
          setIsModalOpen(false);
        }}
        destroyOnClose
        footer={false}
        title={"Sửa thông tin"}
      >
        <CreateForm data={data} id={ID} setIsModalOpen={setIsModalOpen} />
      </Modal>
      <Modal
        width='70vw'
        open={createModal}
        onCancel={() => {
          dispatch(setLocate("vi"));
          setCreateModal(false);
        }}
        footer={false}
        destroyOnClose
        title={"Thêm thông tin"}
      >
        <Create
          modal={isModalOpen}
          typeOption={typeOption}
          setIsModalOpen={setCreateModal}
        />
      </Modal>
    </>
  );
});
export default TableItems;
