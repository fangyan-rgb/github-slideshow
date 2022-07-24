import http from '@/http';

//下载pdf
export function getPdfView(params = {}) {
    params = {...params};
    return http.getAjax('/order/print_invoice/get_pdf_view', params);
}
//下载jpg
export function getJpgView(params = {}) {
    params = {...params};
    return http.getAjax('', params);
}