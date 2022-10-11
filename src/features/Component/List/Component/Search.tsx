import React, { memo } from "react";
import clsx from "clsx";
import style from "../style.module.scss";
import { Button, Form, Input, Select } from "antd";
import { Option } from "antd/lib/mentions";
export interface SearchProps {}

const Search = memo((props: SearchProps) => {
  const [form] = Form.useForm();
  return (
    <div className={clsx(style.Search)}>
      <Form form={form} layout='inline'>
        <Form.Item name={"field 1"}>
          <label htmlFor='field1'>field 1</label>
          <Input id='field1' placeholder='input placeholder' />
        </Form.Item>
        <Form.Item name={"field 2"}>
          <label htmlFor='field2'>field 2</label>
          <Input id='field2' placeholder='input placeholder' />
        </Form.Item>
        <Form.Item name={"list 1"}>
          <label htmlFor='list1'>list 1</label>
          <Select id='list1'>
            <Option value='1'>option 1</Option>
            <Option value='2'>option 2</Option>
          </Select>
        </Form.Item>
        <Form.Item name={"list 2"}>
          <label htmlFor='list2'>list 2</label>
          <Select id='list2'>
            <Option value='1'>option 1</Option>
            <Option value='2'>option 2</Option>
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
