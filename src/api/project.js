import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/project/page',
        method: 'get',
        params: query
    });
};


export const deletePorject = query => {
    return request({
        url: '/project/'+query.id,
        method: 'delete'
    });
};
export const checkClientId = query => {
    return request({
        url: '/project/edit/checkUnique',
        method: 'delete',
        params: query
    });
};
