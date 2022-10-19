import { Button, Card, Col, List, Row } from "antd";
import React from "react";
import clsx from "clsx";
import style from "../../style.module.scss";
import { useAppSelector } from "../../../../../app/hooks";
import { selectData } from "../../../../../app/store";
import { Obj } from "reselect/es/types";
export interface SnippetsProps {
  data: [any];
}

const Snippets = ({ data }: SnippetsProps) => {
  console.log(data);
  return (
    <>
      <List
        bordered
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item className={clsx("d-flex", style.snippets)}>
            <span>Tên khối: {item["title"]}</span>

            <Row
              className={clsx("d-flex", style.snipContent)}
              gutter={[16, 16]}
            >
              {item?.relations.map((item) => (
                <Col span={8}>
                  <Card
                    title={item.title ? item.title : item.name}
                    bordered={true}
                  >
                    Card content
                  </Card>
                </Col>
              ))}
            </Row>
          </List.Item>
        )}
        footer={
          <Button className={clsx("d-flex", style.snipFooter)}>
            Tạo khối nội dung
          </Button>
        }
      ></List>
    </>
  );
};
export default Snippets;
