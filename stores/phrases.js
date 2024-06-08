import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const usePhrasesStore = defineStore('phrases', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;
    // const { showMessage } = useNotification();

    const store = reactive({
        phrases: [],
        categories: [],
        phrases_id: null,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
        update_version: false,
    });

    const create = reactive({
        phrase_category_id: '',
        uzbek: '',
        korean: '',
    });

    const create_category = reactive({
        color: '',
        photo: '',
        title: '',
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }

        for (let i in create_category) {
            create_category[i] = '';
        }
    }

    // phrases
    function createPhrase() {
        if (isLoading.isLoadingType('createPhrase')) {
            return;
        }
        if (modal.edit) {
            return updatePhrase();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (let i in create) {
            if (!create[i]) {
                return isLoading.showMessage(i + ' is empty', 'warning');
            }
            formData.append(i, create[i]);
        }

        formData.append('phrase_category_id', create.phrase_category_id.id);
        isLoading.addLoading('createPhrase');
        axios
            .post(baseUrl + `phrases`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getPhrases();
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createPhrase');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('createPhrase');
            });
    }

    function updatePhrase() {
        if (isLoading.isLoadingType('createPhrase')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        formData.append('phrase_category_id', create.phrase_category_id.id);
        isLoading.addLoading('createPhrase');
        axios
            .put(baseUrl + `phrases/${store.phrases_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getPhrases();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('createPhrase');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('createPhrase');
            });
    }

    function getPhrases() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getPhrases');
        const current_page = isLoading.store.pagination.current_page;
        axios
            .get(baseUrl + `phrases?page=${current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.phrases = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data[i];
                }
                isLoading.removeLoading('getPhrases');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getPhrases');
            });
    }

    function deletePhrase() {
        if (isLoading.isLoadingType('getUserById')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('getUserById');
        axios
            .delete(baseUrl + `phrases/${store.phrases_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                isLoading.removeLoading('getUserById');
                modal.delete = false;
                getPhrases();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message);
                isLoading.removeLoading('getUserById');
            });
    }

    // category
    function createCategory() {
        if (isLoading.isLoadingType('createCategory')) {
            return;
        }
        if (modal.edit) {
            return updateCategory();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (let i in create_category) {
            if (!create_category[i]) {
                return isLoading.showMessage(i + ' is empty', 'warning');
            }
            formData.append(i, create_category[i]);
        }
        isLoading.addLoading('createCategory');
        axios
            .post(baseUrl + `phrase/category`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createCategory');
                getCategories();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('createCategory');
            });
    }

    function updateCategory() {
        if (isLoading.isLoadingType('createCategory')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (let i in create_category) {
            formData.append(i, create_category[i]);
        }
        isLoading.addLoading('createCategory');
        axios
            .post(baseUrl + `phrase/category/${store.phrases_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getCategories();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('createCategory');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('createCategory');
            });
    }

    function updateVersion() {
        if (isLoading.isLoadingType('updatephrases')) {
            return;
        }
        const token = localStorage.getItem('token');
        modal.update_version = false;
        isLoading.addLoading('updatephrases');
        axios
            .post(baseUrl + `phrases-to-json`, null, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage("Ma'lumotlar yangilandi", 'success');
                isLoading.removeLoading('updatephrases');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage('Xatolik yuz berdi!', 'error');
                isLoading.removeLoading('updatephrases');
            });
    }

    function getCategories(type) {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getCategories');
        let url = '';
        if (type == 'no_page') {
            url = 'phrase/category';
        } else {
            url = `phrase/category?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`;
        }
        axios
            .get(baseUrl + url, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.categories = res.data?.data;
                if (type != 'no_page') {
                    for (let i in isLoading.store.pagination) {
                        isLoading.store.pagination[i] = res.data.meta[i];
                    }
                }

                isLoading.removeLoading('getCategories');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getCategories');
            });
    }

    function deleteCategory() {
        if (isLoading.isLoadingType('deleteCategory')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteCategory');
        axios
            .delete(baseUrl + `phrase/category/${store.phrases_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully', 'success');
                isLoading.removeLoading('deleteCategory');
                modal.delete = false;
                getCategories();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('deleteCategory');
            });
    }

    return {
        store,
        modal,
        create,
        create_category,
        clearData,
        createPhrase,
        updatePhrase,
        getPhrases,
        deletePhrase,
        getCategories,
        createCategory,
        deleteCategory,
        updateVersion,
    };
});
