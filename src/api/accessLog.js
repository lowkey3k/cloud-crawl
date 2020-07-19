import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/access_log/page',
        method: 'get',
        params: query
    });
};


export const deleteAccessLog = query => {
    return request({
        url: '/access_log/'+query.id,
        method: 'delete'
    });
};
