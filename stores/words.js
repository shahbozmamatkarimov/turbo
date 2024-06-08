import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useWordStore = defineStore('word', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;
    // const { showMessage } = useNotification();

    const store = reactive({
        words: [],
        word_id: null,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
        update_version: false,
    });

    const create = reactive({
        uzbek: '',
        korean: '',
        transcript: '',
        description: '',
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
    }

    function createWord() {
        if (isLoading.isLoadingType('createWord')) {
            return;
        }
        if (modal.edit) {
            return updateWord();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        isLoading.addLoading('createWord');
        axios
            .post(baseUrl + `words`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getWords();
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createWord');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                isLoading.showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('createWord');
            });
    }

    function updateWord() {
        if (isLoading.isLoadingType('createWord')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        isLoading.addLoading('createWord');
        axios
            .put(baseUrl + `words/${store.word_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getWords();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('createWord');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('createWord');
            });
    }

    function updateVersion() {
        if (isLoading.isLoadingType('updateWord')) {
            return;
        }
        modal.update_version = false;
        const token = localStorage.getItem('token');
        isLoading.addLoading('updateWord');
        axios
            .post(baseUrl + `words-to-json`, null, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage("Ma'lumotlar yangilandi", 'success');
                isLoading.removeLoading('updateWord');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage('Xatolik yuz berdi!', 'error');
                isLoading.removeLoading('updateWord');
            });
    }

    function getWords() {
        isLoading.addLoading('getWords');
        const token = localStorage.getItem('token');
        axios
            .get(baseUrl + `words-get?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                store.words = res.data?.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data[i];
                }
                isLoading.removeLoading('getWords');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getWords');
            });
    }

    function getUserById() {
        const token = localStorage.getItem('token');
        const id = router.currentRoute.value.params.id;
        isLoading.addLoading('getUserById');
        axios
            .get(baseUrl + `users/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.userbyid = res.data.data;
                isLoading.removeLoading('getUserById');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getUserById');
            });
    }

    function deleteWord() {
        if (isLoading.isLoadingType('deleteWord')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteWord');
        axios
            .delete(baseUrl + `words/${store.word_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully', 'success');
                isLoading.removeLoading('deleteWord');
                getWords();
                modal.delete = false;
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('deleteWord');
            });
    }

    return { store, modal, create, createWord, getWords, getUserById, clearData, deleteWord, updateVersion };
});
