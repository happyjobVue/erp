import axios from 'axios';
//제조사 조회 api
export const fetchManufacturers = async () => {
    try {
        const response = await axios.post(
            '/api/business/sales-plan/getmanufacturer.do'
        );
        return response.data.manuFacturerList;
    } catch (error) {
        console.error('제조사 목록 오류:', error);
        return [];
    }
};

//제조사 제품 조회 api
export async function fetchProductsByManufacturer(industryCode) {
    try {
        const params = new URLSearchParams({ industry_code: industryCode });
        const response = await axios.post(
            '/api/business/sales-plan/getProductList.do',
            params
        );
        return response.data.productList;
    } catch (error) {
        console.error('제품 목록 오류:', error);
        return [];
    }
}

//거래처 조회 api
export async function fetchClient() {
    try {
        const response = await axios.post('/api/business/searchClientList.do');
        return response.data.clientList;
    } catch (error) {
        console.error('거래처 목록 오류:', error);
        return [];
    }
}

//제품 전체 조회 api
export async function productListAll() {
    try {
        const response = await axios.post(
            '/api/business/estimate-list/productNamesBody.do'
        );
        return response.data.productNameList;
    } catch (error) {
        console.error('거래처 목록 오류:', error);
        return [];
    }
}
