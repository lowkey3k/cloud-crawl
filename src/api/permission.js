import request from '../utils/request';

export const getPermissionList = query => {
    return request({
        url: '/permission/list',
        method: 'get',
        params: query
    });
};


export const getPermissionPage = query => {
    return request({
        url: '/permission/page',
        method: 'get',
        params: query
    });
};

export const getPermissionByRoleId = roleId => {
    return request({
        url: '/permission/getByRole/'+roleId,
        method: 'get'
    });
};

export const getPermissionTree = query => {
    return request({
        url: '/permission/param/tree',
        method: 'get',
        params: query
    });
};

export const addPermission = data => {
    return request({
        url: '/permission',
        method: 'post',
        data: data
    });
};

export const editCheckUnique = param => {
    return request({
        url: '/permission/add/checkUnique',
        method: 'get',
        params: param
    });
};

export const editPermission = data => {
    return request({
        url: '/permission/update',
        method: 'put',
        data: data
    });
};

export const deletePermission = query => {
    return request({
        url: '/permission/'+query.id,
        method: 'delete'
    });
};

export const roleAddPermission  = data => {
    return request({
        url: '/role_permission/saveOrUpdate',
        method: 'put',
        data: data
    });
};
