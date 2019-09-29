import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    // eslint-disable-next-line max-len
    const { children, loading } = this.props;
    const token = localStorage.getItem('ingens-x-token');
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!token && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!token) {
      return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    }

    return children;
  }
}

export default connect(({ loading }) => ({
  // currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
