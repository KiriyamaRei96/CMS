import React, { memo } from "react";
import clsx from "clsx";
import style from "../style.module.scss";
import { Button, Form, Input, Select } from "antd";

export interface SearchProps {}

const Search = memo((props: SearchProps) => {
  const [form] = Form.useForm();
  const onFinish = (value: any) => {};
  return (
    <div className={clsx(style.Search)}>
      <Form onFinish={onFinish} form={form} layout='inline'>
        <Form.Item className='vetical-input' label={"field1"} name={"field1"}>
          <Input placeholder='input placeholder' />
        </Form.Item>
        <Form.Item className='vetical-input' label={"field2"} name={"field2"}>
          <Input placeholder='input placeholder' />
        </Form.Item>
        <Form.Item className='vetical-input' label={"list1"} name={"list1"}>
          <Select id='list1'>
            <Select.Option value='1'>option 1</Select.Option>
            <Select.Option value='2'>option 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className='vetical-input' label={"field2"} name={"list2"}>
          <Select id='list2'>
            <Select.Option value='1'>option 1</Select.Option>
            <Select.Option value='2'>option 2</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
export default Search;
