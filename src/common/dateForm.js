export const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
};

export const formatMonth = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return year + '-' + month;
};

export const getToday = () => {
    const today = new Date();
    const transformToday = formatDate(today);
    return transformToday;
};

export const getMonth = () => {
    const today = new Date();
    const transformMonth = formatMonth(today);
    return transformMonth;
};
