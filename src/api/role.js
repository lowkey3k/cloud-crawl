import request from '../utils/request';

export const getRoleList = query => {
    return request({
        url: '/role/list',
        method: 'get',
        params: query
    });
};

export const getRolePage = query => {
    return request({
        url: '/role/page',
        method: 'get',
        params: query
    });
};

export const addRole = data => {
    return request({
        url: '/role',
        method: 'post',
        data: data
    });
};


export const userAddRole = data => {
    return request({
        url: '/user_role/saveOrUpdate',
        method: 'put',
        data: data
    });
};


export const editCheckUnique = param => {
    return request({
        url: '/role/add/checkUnique',
        method: 'get',
        params: param
    });
};

export const deleteRole = query => {
    return request({
        url: '/role/'+query.id,
        method: 'delete'
    });
};

export const editRole = data => {
    return request({
        url: '/role/update',
        method: 'put',
        data: data
    });
};
