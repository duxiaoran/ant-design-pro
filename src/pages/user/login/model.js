import { routerRedux } from 'dva/router';
// import { fakeAccountLogin, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import request from '@/utils/request';


async function fakeAccountLogin(params) {
  return request('/api/auth/local', {
    method: 'POST',
    data: params,
  });
}

async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    user: {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload, 888);
      const response = yield call(fakeAccountLogin, { identifier: payload.userName, password: payload.password });
      console.log(response, 2222);
      yield put({
        type: 'changeLoginStatus',
        payload: { ...response, status: response.ok === false ? 'error' : 'ok', type: 'account' },
      });

      if (response.ok !== false) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      console.log(payload, 9888);
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(['admin', 'user']);
      console.log(payload, 9999);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
