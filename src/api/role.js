import request from '../utils/request';

export const getRoleList = query => {
    return request({
        url: '/role/list',
        method: 'get',
        params: query
    });
};



export const userAddRole = data => {
    return request({
        url: '/user_role/batch',
        method: 'post',
        data: data
    });
};
