// import lodash from 'lodash';

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import {
  Row,
  Col,
  Card,
  Form,
  Button,
  message,
  Input,
  Divider,
  Table,
  Modal,
  Popconfirm,
  DatePicker,
  Select,
  Badge,
} from 'antd';
// import lodash from 'lodash';
import styles from './index.less';
// import UserSelect from '@/components/Userselect';
const { RangePicker } = DatePicker;
const { Option } = Select;
const BlockName = 'userrole';

/* eslint react/no-multi-comp:0 */
@connect(({ userrole, loading }) => ({
  userrole,
  loading: loading.models.useruser,
}))
@Form.create()
class DataForm extends PureComponent {
  constructor(props) {
    super(props);
    const {
 id, name, description, status, paper, startDate, endDate
} = props.values;

    this.state = {
      formVals: {
        id: id || '',
        name: name || '',
        description: description || '',
        status: status !== undefined ? status : 1,
        paper: paper && paper.id,
        date: startDate && endDate && [moment(startDate), moment(endDate)],
      },
    };
    this.title = props.isUpdate ? '修改' : '添加';
  }

  // eslint-disable-next-line react/sort-comp
  okHandle = () => {
    const { form, handleUpdate, isUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      if (formVals.date) {
        formVals.startDate = formVals.date[0].toDate();
        formVals.endDate = formVals.date[1].toDate();
        delete formVals.date;
      }
      handleUpdate(formVals, isUpdate);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      loading,
      userrole: { list },
    } = this.props;
    const { formVals } = this.state;
    const dateFormat = 'YYYY-MM-DD HH:mm';
    const disabledDate = current => current && current <= moment().subtract(1, 'days');

    return (
      <Modal
        title={this.title}
        visible={modalVisible}
        onOk={this.okHandle}
        maskClosable={false}
        onCancel={() => handleModalVisible()}
        confirmLoading={loading}
      >
        <Card bordered={false}>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: formVals.name
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: formVals.description
              })(<Input.TextArea />)}
            </Form.Item>
            <Form.Item label="时间">
              {getFieldDecorator('date', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: formVals.date
              })(
                <RangePicker
                  disabledDate={disabledDate}
                  // disabledTime={disabledRangeTime}
                  format={dateFormat}
                  showTime
                />,
              )}
            </Form.Item>
            <Form.Item label="试卷">
              {getFieldDecorator('paper', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: formVals.paper
              })(
                <Select>
                  {list.map(n => (
                    <Option key={n.id} value={n.id}>
                      {n.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="状态">
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: formVals.status
              })(
                <Select>
                  <Option key={1} value={1}>
                    正常
                  </Option>
                  <Option key={0} value={0}>
                    关闭
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ useruser, loading }) => ({
  useruser,
  loading: loading.models.useruser
}))
@Form.create()
class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      updateValues: {},
      formValues: {}
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: `${BlockName}/fetch` });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const getValue = obj => Object.keys(obj)
        .map(key => obj[key])
        .join(',');
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      _start: (pagination.current - 1) * pagination.pageSize,
      _limit: pagination.pageSize,
      ...filters,
      ...formValues
    };

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        // eslint-disable-next-line no-underscore-dangle
        params._sort = `${sorter.field}:asc`;
      } else {
        // eslint-disable-next-line no-underscore-dangle
        params._sort = `${sorter.field}:desc`;
      }
    }

    dispatch({
      type: `${BlockName}/fetch`,
      payload: { pagination, params },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      updateValues: record || {},
      isUpdate: !!record,
    });
  };

  handleUpdate = (fields, isUpdate) => {
    const { dispatch } = this.props;
    if (isUpdate) {
      dispatch({
        type: `${BlockName}/update`,
        payload: fields,
        callback: () => {
          message.success('更新成功');
          this.handleModalVisible();
        },
      });
    } else {
      dispatch({
        type: `${BlockName}/add`,
        payload: fields,
        callback: () => {
          message.success('添加成功');
          this.handleModalVisible();
        },
      });
    }
  };

  // eslint-disable-next-line react/sort-comp
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formValues } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name', { initialValue: formValues.name })(
                <Input placeholder="请输入名称" />,
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // onFinish={this.userSelectedOk}
  //         onCancel={this.userSelectVisible}
  // userSelectedOk = arr => {
  //   const {
  //     form: { setFieldsValue },
  //   } = this.props;
  //   if (arr.length > 0) {
  //     // eslint-disable-next-line no-underscore-dangle
  //     setFieldsValue({ uploadUser: arr[0]._id, realname: arr[0].realname });
  //   }
  //   this.setState({ showUserSelect: false });
  // };

  // userSelectVisible = () => {
  //   this.setState({ showUserSelect: false });
  // };

  // toggleForm = () => {
  //   const { expandForm } = this.state;
  //   this.setState({
  //     expandForm: !expandForm,
  //   });
  // };

  renderForm() {
    // const { expandForm } = this.state;
    return this.renderSimpleForm();
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = Object.keys(fieldsValue).reduce((obj, k) => {
        const newObj = { ...obj };
        if (fieldsValue[k] !== undefined) newObj[k] = fieldsValue[k];
        return newObj;
      }, {});
      this.setState({ formValues: values });
      dispatch({ type: `${BlockName}/fetch`, payload: { params: values } });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
    dispatch({ type: `${BlockName}/fetch`, payload: {} });
  };

  deletePaper = id => {
    const { dispatch } = this.props;
    dispatch({ type: `${BlockName}/del`, payload: id });
  };

  render() {
    const {
      useruser: { list, pagination },
      loading,
    } = this.props;
    const { modalVisible, updateValues, isUpdate } = this.state;
    // console.log(list, 8888);

    // eslint-disable-next-line no-undef
    const columns = [
      {
        title: '考试名称',
        dataIndex: 'name',
        render: val => <span>{val}</span>,
        width: 120,
      },
      {
        title: '试卷名称',
        dataIndex: 'paper',
        render: val => <span>{val && val.name}</span>,
        width: 120,
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        render: val => moment(val).format('lll'),
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        render: val => moment(val).format('lll'),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => <Badge status={val ? 'success' : 'error'} text={val ? '正常' : '关闭'} />,
      },
      {
        title: '操作',
        render: (_text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={() => this.deletePaper(record.id)}>
              <a href="#">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <div>
          <Card>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              </div>
              {
                <Table
                  loading={loading}
                  dataSource={list}
                  pagination={pagination}
                  columns={columns}
                  onChange={this.handleStandardTableChange}
                  rowKey="id"
                />
              }
            </div>
          </Card>
        </div>
        {modalVisible && (
          <DataForm
            handleUpdate={this.handleUpdate}
            handleModalVisible={this.handleModalVisible}
            modalVisible={modalVisible}
            values={updateValues}
            isUpdate={isUpdate}
          />
        )}
        {/* <UserSelect
          type="user"
          maxSelect={1}
          visible={showUserSelect}
          onFinish={this.userSelectedOk}
          onCancel={this.userSelectVisible}
          // disabledKeys={disabledUsers}
          usertype={[0, 10]}
          cid="2"
        /> */}
      </PageHeaderWrapper>
    );
  }
}

export default Item;
