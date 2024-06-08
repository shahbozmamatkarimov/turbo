import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
import axios from 'axios';

export const useCheckListStore = defineStore('checklist', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        settings: {},
        name: '',
        data: '',
        id: '',
        checkList: [],
    });

    const modal = reactive({
        edit: false,
        create: false,
        delete: false,
    });

    const create = reactive({
        title: '',
        description: '',
        photo: null,
        document: null,
        status: 'new',
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
    }

    function getChecklist() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getChecklist');
        axios
            .get(baseUrl + 'checklist', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.checkList = res.data;
                isLoading.removeLoading('getChecklist');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getChecklist');
            });
    }

    function updateCheckList() {
        if (isLoading.isLoadingType('updateChecklist')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('updateChecklist');
        let data = {};
        for (let i in create) {
            if (create[i]) {
                data[i] = create[i];
            }
        }
        const formData = new FormData();
        for (let i in data) {
            formData.append(i, data[i]);
        }
        axios
            .post(baseUrl + `checklist/${store.id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getChecklist();
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('updateChecklist');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.showMessage('Xatolik yuz berdi', 'error');
                isLoading.removeLoading('updateChecklist');
            });
    }

    function createCheckList() {
        if (isLoading.isLoadingType('updateChecklist')) {
            return;
        }
        if (modal.edit) {
            return updateCheckList();
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('updateChecklist');
        const formData = new FormData();
        formData.append('name', store.name);
        formData.append('value', store.data);
        for (let i in create) {
            formData.append(i, create[i]);
        }
        axios
            .post(baseUrl + `checklist`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then((res) => {
                modal.create = false;
                getChecklist();
                isLoading.showMessage("Qo'shildi", 'success');
                isLoading.removeLoading('updateChecklist');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.showMessage('Xatolik yuz berdi', 'error');
                isLoading.removeLoading('updateChecklist');
            });
    }

    function deleteCheckList() {
        if (isLoading.isLoadingType('deleteCheckList')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteCheckList');
        axios
            .delete(baseUrl + `checklist/${store.id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.delete = false;
                getChecklist();
                isLoading.showMessage("Ma'lumotlar o'chirildi", 'success');
                isLoading.removeLoading('deleteCheckList');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.showMessage('Xatolik yuz berdi', 'error');
                isLoading.removeLoading('deleteCheckList');
            });
    }

    return {
        store,
        create,
        modal,
        clearData,
        getChecklist,
        updateCheckList,
        createCheckList,
        deleteCheckList,
    };
});
