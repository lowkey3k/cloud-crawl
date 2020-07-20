import request from '../utils/request';

export const findTreeByPid = query => {
    return request({
        url: '/data_dict/param/tree',
        method: 'get',
        params: query
    });
};


