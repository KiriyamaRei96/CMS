import React, { memo, ReactElement, useState } from "react";
import clsx from "clsx";
import style from "../style.module.scss";
import { Button, Form, Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectData } from "../../../../store/store";
import { setLocate, setParentID } from "../slice/slice";
import { userInfoSelector } from "../../Login/slice/UserSlice";

export interface SearchProps {
  locale: string;
  city: Array<ReactElement> | undefined;
}

const Search = ({ locale, city = undefined }: SearchProps) => {
  const [form] = Form.useForm();
  const localeArr = useAppSelector(selectData).localeArr;
  const actionApi = useAppSelector(selectData).actionApi;
  const infoRole = useAppSelector(userInfoSelector)?.info?.role;
  const parentID = useAppSelector(selectData).parentID;

  const dispatch = useAppDispatch();

  const option = Object.keys(localeArr).map((key) => {
    return (
      <Select.Option value={key}>
        <img className="icon" src={localeArr[key].icon} alt=""></img>
      </Select.Option>
    );
  });

  const onFinish = (value: any) => {
    dispatch({
      type: "SEARCH_ROW_REQUESTED",
      payload: {
        action: actionApi,
        limit: 10,
        page: 1,
        search: value.search,
        locale,
      },
    });
  };

  return (
    <div className={clsx(style.Search)}>
      <Form onFinish={onFinish} form={form} layout="inline">
        <Form.Item label={"Tìm kiếm theo tiêu đề"} name={"search"}>
          <Input
            allowClear={{
              clearIcon: (
                <i
                  onClick={() =>
                    dispatch({
                      type: "SEARCH_ROW_REQUESTED",
                      payload: {
                        action: actionApi,
                        limit: 10,
                        page: 1,
                        search: "",
                        locale,
                      },
                    })
                  }
                  className="fa-regular fa-circle-xmark"
                ></i>
              ),
            }}
            placeholder="Nhập tiêu đề"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
        <Form.Item label={"Ngôn ngữ"}>
          <Select
            onChange={(value) => {
              dispatch(setLocate(value));
              dispatch({
                type: "SEARCH_ROW_REQUESTED",
                payload: {
                  action: actionApi,
                  limit: 10,
                  page: 1,
                  search: "",
                  locale: value,
                },
              });
            }}
            value={locale}
          >
            {option}
          </Select>
        </Form.Item>
        {infoRole?.id !== "2" && infoRole?.parentUser === null ? (
          <Form.Item label={"Thành phố"}>
            <Select
              placeholder="Thành phố"
              onChange={(value) => {
                dispatch(setParentID(value));
                dispatch({
                  type: "SEARCH_ROW_REQUESTED",
                  payload: {
                    action: actionApi,
                    limit: 10,
                    page: 1,
                    search: "",
                    locale: locale,
                  },
                });
              }}
              value={parentID}
            >
              {city}
            </Select>
          </Form.Item>
        ) : (
          false
        )}
      </Form>
    </div>
  );
};
export default Search;
