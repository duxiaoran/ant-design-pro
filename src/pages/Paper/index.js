// import lodash from 'lodash';

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  message,
  Dropdown,
  Icon,
  Menu,
  Input,
  Divider,
  Select,
  Badge,
  Popconfirm,
  Table,
} from 'antd';
import lodash from 'lodash';
import Link from 'umi/link';
import styles from './index.less';


import DataForm from './components/upsert';

const BlockName = 'userrole';

const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ useruser, loading }) => ({
  useruser,
  loading: loading.models.useruser,
}))
@Form.create()
class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      updateValues: {},
      formValues: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: `${BlockName}/fetch` });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      _start: (pagination.current - 1) * pagination.pageSize,
      _limit: pagination.pageSize,
      ...filters,
      ...formValues,
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
    // let values = {};
    // let flagUpdate = false;
    // if (record) {
    //   values = { ...record };
    //   flagUpdate = true;
    // }

    // this.setState({
    //   modalVisible: !!flag,
    //   updateValues: values,
    //   isUpdate: flagUpdate,
    // });
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入名称" />)}
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator, getFieldValue },
      category1,
    } = this.props;
    getFieldDecorator('uploadUser', { initialValue: undefined });
    getFieldDecorator('realname', { initialValue: undefined });
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入名称" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="分类">
              {getFieldDecorator('category')(
                <Select placeholder="请选择">
                  {category1.list.map(n => (
                    <Option value={n.id} key={n.id}>
                      {n.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="上传人">
              <Button type="primary" onClick={() => this.setState({ showUserSelect: true })}>
                选择上传人
              </Button>
              <span style={{ marginLeft: 10, color: 'red' }}> {getFieldValue('realname')}</span>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, category1 } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = Object.keys(fieldsValue).reduce((obj, k) => {
        const newObj = { ...obj };
        if (k === 'category' && fieldsValue[k]) {
          category1.categoryList.forEach(n => {
            if (n.id === fieldsValue[k]) {
              newObj[`category${n.level}`] = fieldsValue.category;
            }
          });
        }
        if (['category', 'realname'].indexOf(k) === -1 && fieldsValue[k] !== undefined) newObj[k] = fieldsValue[k];
        return newObj;
      }, {});

      this.setState({ formValues: values });
      dispatch({ type: 'item1/fetch', payload: { params: values } });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
    dispatch({ type: 'item1/fetch', payload: {} });
  };

  render() {
    const { useruser: { pagination, list }, loading } = this.props;
    const {
      selectedRowKeys,
      modalVisible,
      updateValues,
      isUpdate,
    } = this.state;
    console.log(this.props, 999);

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      // handleUploadFile: this.handleUploadFile,
    };

    // eslint-disable-next-line no-undef
    const columns = [
      {
        title: '分类',
        render: (_text, record) => (
          <div style={{ fontSize: 12 }}>
            <div>{record.category1 ? record.category1.name : ''}</div>
          </div>
        ),
      },
      {
        title: '排序',
        dataIndex: 'sort',
        sorter: true,
        render: val => <span>{val}</span>,
        width: 120,
      },
      {
        title: '添加时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 120,
      },
      {
        title: '操作',
        render: (_text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleLogModalVisible(true, record.id)}>日志</a>
          </Fragment>
        ),
        width: 160,
      },
    ];

    return (
      <PageHeaderWrapper>
        <div>
          <Card>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
              <Link to={{
                  pathname: '/exam/paper/question',
                    query: {
                      id: 6,
                      value: 'lala',
                    },
                  }}>
                    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                      新建
                    </Button>
              </Link>

              </div>
              {
                <Table
                  columns={columns}
                  pagination={pagination}
                  dataSource={list}
                  onChange={this.handleStandardTableChange}
                  loading={loading}
                  rowKey="id"
                  // locale={{ emptyText: '未找到符合条件车辆' }}
                />
              }
            </div>
          </Card>
        </div>
        {modalVisible && (
          <DataForm
            {...parentMethods}
            modalVisible={modalVisible}
            values={updateValues}
            isUpdate={isUpdate}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Item;
