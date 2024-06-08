import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
import axios from 'axios';

export const useSettingsStore = defineStore('settings', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        settings: {},
        name: '',
        data: '',
        id: '',
    });

    const modal = reactive({
        edit: false,
    });

    function getSettings() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getSettings');
        axios
            .get(baseUrl + 'setting', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    "APP-TOKEN": 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                for (let i of res.data) {
                    store.settings[i.name] = i;
                }
                isLoading.removeLoading('getSettings');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getSettings');
            });
    }

    function updateSettings() {
        if (isLoading.isLoadingType('updateSettings')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('updateSettings');
        const formData = new URLSearchParams();
        formData.append('name', store.name);
        formData.append('value', store.data);
        axios
            .put(baseUrl + `setting`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    "APP-TOKEN": 'Xw3IMBRkzMLxRm4',

                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then((res) => {
                modal.edit = false;
                getSettings();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateSettings');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('updateSettings');
            });
    }

    return {
        store,
        modal,
        getSettings,
        updateSettings,
    };
});
