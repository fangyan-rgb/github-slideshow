/**
 * CaseeLee
 * @param {*} orginArr 源数组
 * @param {*} props 复制属性
 */
export const handleClipboard = (orginArr = [], props = '')=> {
    if (!Array.isArray(orginArr)|| typeof(props) !== 'string' ) return
    const content = orginArr.map(item => item[props]).filter(item => item).join(',')
    window.clipboardData.setData("Text", content);
}