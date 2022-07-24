/**
 * 客户端模糊搜索兼容
 * @param {*} el :指定dom
 * @param {*} binding :绑定对象
 */
import debounce from 'throttle-debounce/debounce';

let remoteTime = 500;
export const filter = function (el) {
    let debounceFn;
    if (el.getElementsByClassName('el-input__inner')) {
        const tag = el.getElementsByClassName('el-input__inner')[0]
        tag.oninput = (e) => {
            if (!debounceFn) {
                debounceFn = debounce(remoteTime, () => {
                    const keycode = 13;
                    e.target.pressKey(keycode);
                })
            } 
            debounceFn()
        }
    }
}

export default {
    filter,
}

