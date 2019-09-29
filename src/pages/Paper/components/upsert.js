
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Modal, message, Input, Select, InputNumber, Checkbox } from 'antd';
import lodash from 'lodash';

// import UploaderManyImage from '@/components/UploaderManyImage';

const InputGroup = Input.Group;
const status = ['上架', '下架'];
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ category1, address, attribute, city, loading }) => ({
  category1,
  attribute,
  city,
  address,
  loading: loading.models.item,
}))
@Form.create()
class DataForm extends PureComponent {
  // @ts-ignore
  constructor(props) {
    super(props);
    // const list = [];
    const {
      id,
      name,
      category1,
      extra,
      status: newStatus,
      uploadUser,
      sort,
      specification,
      price1,
    } = props.values;

    this.state = {
      formVals: {
        id: id || '',
        name: name || '',
        price1: price1 || '',
        category1: category1 ? category1.id : '',
        extra: extra || {},
        status: newStatus !== undefined ? newStatus : 0,
        sort: sort || 1,
        specification: specification || [],
        // eslint-disable-next-line no-underscore-dangle
        uploadUser: uploadUser ? uploadUser._id : '',
      },
    };
    this.title = props.isUpdate ? '修改' : '添加';
  }

  // eslint-disable-next-line react/sort-comp
  okHandle = () => {
    const { form, handleUpdate, isUpdate, category1 } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      if (!formVals.extra.unit) {
        message.error('单价必填');
        return;
      }
      if (formVals.category1) {
        const info = category1.list.find(n => n._id === formVals.category1);
        if (info) {
          formVals.extra.foodtype = info.foodtype;
        }
      }
      const record = Object.keys(formVals).reduce((formData, k) => {
        if (lodash.isArray(formVals[k]) || lodash.isObject(formVals[k])) {
          formData.append(k, JSON.stringify(formVals[k]));
        } else if (!lodash.isArray(formVals[k])) {
          formData.append(k, formVals[k]);
        }
        return formData;
      }, new FormData());

      const img = this.uploaderImg.getImg();

      if (img.uploader.length === 0) {
        message.error('图片必填');
        return;
      }
      img.uploader.forEach(fileee => {
        const file = { ...fileee };
        if (file && file.file instanceof Blob) {
          record.append('uploader', file.file);
        } else if (lodash.isObject(file)) {
          record.append('uploader', JSON.stringify(file));
        } else {
          record.append('uploader', file);
        }
      });
      record.append('uploaderSort', JSON.stringify(img.uploaderSort));
      record.append('newFileTimestamp', JSON.stringify(img.newFileTimestamp));

      handleUpdate(record, isUpdate);
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // const {id} = this;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const newKey = keys[keys.length - 1] !== undefined ? keys[keys.length - 1] : -1;
    const nextKeys = keys.concat(newKey + 1);

    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      category1,
      loading,
      values,
    } = this.props;
    const { formVals } = this.state;
    const CheckboxArr = [
      { label: '周一', value: '周一' },
      { label: '周二', value: '周二' },
      { label: '周三', value: '周三' },
      { label: '周四', value: '周四' },
      { label: '周五', value: '周五' },
    ];

    return (
      <Modal
        destroyOnClose
        title={this.title}
        width="80%"
        maskClosable={false}
        keyboard={false}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={loading}
      >
        <Card bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={{ xl: 80, lg: 80, md: 30 }}>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="商品名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入商品名称' }],
                    initialValue: formVals.name,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="所属分类">
                  {getFieldDecorator('category1', {
                    rules: [{ required: true, message: '请选择分类' }],
                    initialValue: formVals.category1,
                  })(
                    <Select>
                      {category1.list.map(n => (
                        <Option value={n.id} key={n.id}>
                          {n.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="商品排序(数字越大越靠前)">
                  {getFieldDecorator('sort', {
                    rules: [{ required: true, message: '请输入文具排序' }],
                    initialValue: formVals.sort,
                  })(<InputNumber placeholder="请输入排序" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xl: 80, lg: 80, md: 30 }}>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="商品价格">
                  <InputGroup compact>
                    {getFieldDecorator('price1', {
                      rules: [{ required: true, message: '请输入价格' }],
                      initialValue: formVals.price1,
                    })(<InputNumber />)}
                    {getFieldDecorator(`extra[unit]`, {
                      // rules: [{ required: true, message: '请输入价格2' }],
                      initialValue: formVals.extra.unit,
                    })(<Input style={{ width: '35%' }} placeholder="请输入单位" />)}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="库存数量">
                  {getFieldDecorator(`extra[count]`, {
                    rules: [{ required: true, message: '请输入库存数量' }],
                    initialValue: formVals.extra.count,
                  })(<InputNumber placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="商品状态">
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择文具状态' }],
                    initialValue: formVals.status,
                  })(
                    <Select>
                      {status.map((n, i) => (
                        // eslint-disable-next-line react/jsx-indent
                        <Option key={n} value={i}>
                          {n}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item label="供应时间">
                {getFieldDecorator('specification', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: formVals.specification,
                })(<Checkbox.Group options={CheckboxArr} />)}
              </Form.Item>
            </Row>
            {/* <UploaderManyImage
              uploaderSort={values.uploaderSort}
              uploader={values.uploader}
              maxUploader={1}
              // aspectRatio={3 / 2}
              ref={el => {
                this.uploaderImg = el;
              }}
              textUploader="商品图片"
            /> */}

            {/* <Divider>以下为可配属性</Divider> */}
            {/* <Row gutter={{ xl: 80, lg: 80, md: 30 }}>{attributeForm()}</Row> */}
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default DataForm;
