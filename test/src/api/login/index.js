
import http from '@/http';

export function loginByUserName (userName, password) {
    const data = {
        user_name: userName,
        pwd: password
    };
    return http.postAjax('/login/userlogin', data);
}

export function loginOut (uid) {
    const data = {
        uid: uid
    };
    return http.postAjax('/login/logout', data);
}

export function updatePassword(obj) {
    const data = {
        uid: obj.uid,
        pwd: obj.oldPwd,
        newpwd: obj.newPwd
    };
    return http.postAjax('/login/updatepwd', data);
}

export function getUserInfo(queryParams) {
    // const data = {};
    return http.getAjax('/login/login/getuserinfo', queryParams);
}