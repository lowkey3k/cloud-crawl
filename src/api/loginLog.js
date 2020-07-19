import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/system_login/page',
        method: 'get',
        params: query
    });
};


export const deleteLoginLog = query => {
    return request({
        url: '/system_login/'+query.id,
        method: 'delete'
    });
};
