import { defineStore } from 'pinia';

export const useModalStore = defineStore('modalState', () => {
    const modalState = ref(false);
    const modalType = ref('');

    const setModalState = () => {
        modalState.value = !modalState.value;
    };
    // 모달 타입('register','edit','view')
    // 모달 타입 설정
    const setModalType = (type) => {
        modalType.value = type;  // 'register', 'edit', 'view' 등
    };


    return { modalState,modalType, setModalState, setModalType };
});
