import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/user/detail',
        method: 'get',
        params: query
    });
};


export const login = query => {
    return request({
        url: '/auth/login',
        method: 'get',
        params: query
    });
};
