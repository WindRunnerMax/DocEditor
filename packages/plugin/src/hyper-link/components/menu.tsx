import { Button, Form, Input, Switch } from "@arco-design/web-react";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { isEmptyValue } from "doc-editor-utils";
import type { FC } from "react";

import type { HyperLinkConfig } from "../types";

interface Props {
  top?: number;
  left?: number;
  config: HyperLinkConfig;
  onConfirm?: (value: HyperLinkConfig) => void;
  onCancel?: () => void;
}

export const HyperLinkMenu: FC<Props> = props => {
  const [form] = useForm();
  const top = isEmptyValue(props.top) ? 0 : props.top + 30;
  const left = isEmptyValue(props.left) ? 0 : props.left - 150;
  const position = props.top || props.left ? "absolute" : void 0;

  return (
    <div className="hyper-link-menu" style={{ left, top, position }}>
      <Form
        initialValues={props.config}
        form={form}
        size="small"
        labelCol={{ span: 7, offset: 0 }}
        wrapperCol={{ span: 17, offset: 0 }}
        labelAlign="left"
        onSubmit={value => props.onConfirm && props.onConfirm(value)}
      >
        <Form.Item label="链接地址" field="href">
          {/* XSS */}
          <Input placeholder="Enter href" />
        </Form.Item>
        <Form.Item className="hyper-link-menu-row" wrapperCol={{ span: 24, offset: 0 }}>
          <Form.Item label="新页面打开" field="blank">
            <Switch defaultChecked={props.config.blank} />
          </Form.Item>
          <Form.Item className="hyper-link-menu-submit">
            <Button size="mini" htmlType="submit" type="primary">
              确定
            </Button>
            <Button size="mini" type="primary" status="danger" onClick={props.onCancel}>
              删除
            </Button>
          </Form.Item>
        </Form.Item>
      </Form>
    </div>
  );
};
