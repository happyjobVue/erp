import { useQuery } from '@tanstack/vue-query';
import {
    fetchClient,
    fetchManufacturers,
    fetchProductsByManufacturer,
    productListAll,
} from '../../common/selectBoxApi';
//제조사 조회
export const useFecthManufacturersQuery = () => {
    return useQuery({
        queryKey: ['fetchManufacturersQuery'],
        queryFn: fetchManufacturers,
        staleTime: 1000 * 5,
    });
};
//제조사 제품 조회
export const useFetchProductsByManufacturer = industryCode => {
    return useQuery({
        queryKey: ['fetchProductsByManufacturerQuery'],
        queryFn: fetchProductsByManufacturer,
        staleTime: 1000 * 5,
    });
};

//거래처 조회
export const useFecthClient = () => {
    return useQuery({
        queryKey: ['fetchClientQuery'],
        queryFn: fetchClient,
        staleTime: 1000 * 5,
    });
};

//제품 전체 조회
export const useProductListAll = () => {
    return useQuery({
        queryKey: ['productListAllQuery'],
        queryFn: productListAll,
        staleTime: 1000 * 5,
    });
};
