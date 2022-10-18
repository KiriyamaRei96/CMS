import React, { memo, useState } from "react";
import clsx from "clsx";
import style from "../style.module.scss";
import { Button, Form, Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectData } from "../../../../app/store";
import { setLocate } from "../slice/slice";

export interface SearchProps {
  locale: string;
}

const Search = ({ locale }: SearchProps) => {
  const [form] = Form.useForm();
  const localeArr = useAppSelector(selectData).localeArr;
  const actionApi = useAppSelector(selectData).actionApi;
  const dispatch = useAppDispatch();

  const option = Object.keys(localeArr).map((key) => {
    return (
      <Select.Option value={key}>
        <img className='icon' src={localeArr[key].icon} alt=''></img>
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
      <Form onFinish={onFinish} form={form} layout='inline'>
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
                  className='fa-regular fa-circle-xmark'
                ></i>
              ),
            }}
            placeholder='Nhập tiêu đề'
          />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
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
      </Form>
    </div>
  );
};
export default Search;
