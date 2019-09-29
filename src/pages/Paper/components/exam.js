import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Form, Button, Modal, Input, Select } from 'antd';
import styles from '../index.less';
import Result from '@/components/Result';
import { BlockName } from '../config';

const { TextArea } = Input;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ item, loading }) => ({
  item,
  loading: loading.models.item,
}))
@Form.create()
class Examine extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  constructor(props) {
    super(props);
    this.state = {
      formVal: {
        id: props.values.id,
        status: 2,
        reason: props.values.reason || '',
      },
      accomplish: false,
    };
  }

  okHandle = () => {
    const { form, dispatch } = this.props;
    const { formVal: oldFormVal } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVal = { ...oldFormVal, ...fieldsValue };
      this.setState({ formVal });
      if (formVal.status === 2) {
        formVal.passTime = new Date();
      }
      dispatch({
        type: `${BlockName}/update`,
        payload: formVal,
        callback: () => {
          this.setState({ accomplish: true });
        },
      });
    });
  };

  renderContent() {
    const {
      form: { getFieldDecorator, getFieldValue },
      handleModalVisible,
    } = this.props;
    const { formVal, accomplish } = this.state;
    if (accomplish) {
      const res = formVal.status === 1 ? '不通过' : '通过';
      return (
        <Result
          type="success"
          title="操作成功"
          description={`您已审核完成，审核结果为 ${res}`}
          actions={
            <Button type="primary" onClick={() => handleModalVisible(false)}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    return (
      <Form>
        <Form.Item label="是否通过" {...this.formLayout}>
          {getFieldDecorator('status', {
            rules: [{ required: true, message: '请输入任务名称' }],
            initialValue: formVal.status,
          })(
            <Select>
              <Option value={2}>通过</Option>
              <Option value={1}>不通过</Option>
            </Select>
          )}
        </Form.Item>
        {getFieldValue('status') === 1 && (
          <Form.Item label="不通过原因" {...this.formLayout}>
            {getFieldDecorator('reason', {
              rules: [{ required: true, message: '请输入任务名称' }],
              initialValue: formVal.reason,
            })(<TextArea placeholder="请输入" />)}
          </Form.Item>
        )}
      </Form>
    );
  }

  render() {
    const { modalVisible, handleModalVisible, loading } = this.props;
    const { accomplish } = this.state;
    this.title = '审核';

    const modalFooter = accomplish
      ? { footer: null, onCancel: () => handleModalVisible(false) }
      : { okText: '保存', onOk: this.okHandle, onCancel: () => handleModalVisible(false) };

    return (
      <Modal
        destroyOnClose
        title={accomplish ? null : this.title}
        // width="80%"
        maskClosable={false}
        keyboard={false}
        visible={modalVisible}
        // onOk={this.okHandle}
        // onCancel={() => handleModalVisible(false)}
        confirmLoading={loading}
        {...modalFooter}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default Examine;
