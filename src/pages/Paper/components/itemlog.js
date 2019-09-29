import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Modal, List } from 'antd';

const replaceObj = {
  '{{createGoodsMessage}}': '上传了新的商品',
  '{{goodsMessage}}': '商品信息',
  '{{goodsState}}': '商品状态',
  '{{0}}': '上架',
  '{{1}}': '下架',
};

const replaceWord = content => {
  let result = content;
  Object.keys(replaceObj).forEach(n => {
    result = result.replace(n, replaceObj[n]);
  });
  return result;
};

/* eslint react/no-multi-comp:0 */
@connect(({ itemlog1, loading }) => ({
  itemlog1,
  loading: loading.models.itemlog1,
}))
@Form.create()
class ItemLog extends PureComponent {
  render() {
    const { modalVisible, handleModalVisible, itemlog1, loading } = this.props;
    this.title = '操作日志';

    return (
      <Modal
        destroyOnClose
        title={this.title}
        // width="80%"
        maskClosable={false}
        keyboard={false}
        visible={modalVisible}
        // onOk={this.okHandle}
        onCancel={() => handleModalVisible(false)}
        footer={false}
        confirmLoading={loading}
      >
        <List
          size="small"
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          dataSource={itemlog1.list}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <span style={{ color: '#f50' }}>
                    {item.operateUser.username} (
                    {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}){' '}
                  </span>
                }
                description={<span>{replaceWord(item.content)}</span>}
              />
            </List.Item>
          )}
        />
      </Modal>
    );
  }
}

export default ItemLog;
