import lodash from 'lodash';
import request from '@/utils/request';
import {
  getData,
  getDataCount,
  addData,
  updateData,
  delData,
  uploadfile,
  deleteMany,
  updateMany,
} from '../services/strapi';
import setup from '../../config/defaultSettings';

const BaseUrl = `${setup.basisUrl}/userusers`;
const BlockName = 'useruser';

function* fetchList(call, put, query) {
  let pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    showTotal: (total, range) => `第${range[0]}-${range[1]} 条记录, 共 ${total} 条记录`,
  };
  let params = {
    _start: 0,
    _limit: 10,
    _sort: 'createdAt:desc',
  };

  if (query && !lodash.isEmpty(query.params)) {
    params = { ...params, ...query.params };
  }

  if (query && !lodash.isEmpty(query.pagination)) {
    pagination = { ...pagination, ...query.pagination };
  }
  const count = yield call(getDataCount, params, BaseUrl);
  let list = [];
  if (count) {
    list = yield call(getData, params, BaseUrl);
  }

  pagination.total = count;
  pagination.list = list;

  yield put({
    type: 'save',
    payload: {
      list,
      pagination,
      params,
    },
  });
}

export default {
  namespace: BlockName, // connect处也需要一同修改
  state: {
    list: [],
    pagination: {},
    params: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield call(fetchList, call, put, payload);
    },
    *add({ payload, callback }, { call, select, put }) {
      yield call(addData, payload, BaseUrl);
      const {
        listData: { params, pagination },
      } = yield select(_ => _[BlockName]);
      yield call(fetchList, call, put, {
        pagination: { ...pagination, current: 1 },
        params: { ...params, _start: 0 },
      });
      if (callback) callback();
    },
    *del({ payload, callback }, { call, select, put }) {
      yield call(delData, payload, BaseUrl);
      const {
        listData: { pagination, params },
      } = yield select(_ => _[BlockName]);
      yield call(fetchList, call, put, { pagination, params });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, select, put }) {
      yield call(updateData, payload, BaseUrl);
      const {
        listData: { pagination, params },
      } = yield select(_ => _[BlockName]);
      yield call(fetchList, call, put, { pagination, params });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
