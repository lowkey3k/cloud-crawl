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

export const logout = query => {
    return request({
        url: '/logout',
        method: 'get'
    });
};



export const edit = data => {
    return request({
        url: '/user/update',
        method: 'put',
        data: data
    });
};

export const deleteUser = query => {
    return request({
        url: '/user/'+query.id,
        method: 'delete'
    });
};
export const deleteByIds = data => {
    return request({
        url: '/user/deleteByIds',
        method: 'delete',
        data:data
    });
};
