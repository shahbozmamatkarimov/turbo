import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useCheckStore = defineStore('check', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        check: [],
        check_id: null,
        max_point: '',
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
        is_new: false,
    });

    const create = reactive({
        points: '',
        group_id: '',
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
    }

    function updateCheck() {
        if (store.max_point < create.points) {
            isLoading.showMessage(`Maximum ball ${store.max_point}`, 'warning');
            return;
        } else if (create.points < 0) {
            isLoading.showMessage(`Minimum ball 0`, 'warning');
            return;
        }
        create.group_id = router.currentRoute.value.params.group_id;

        if (isLoading.isLoadingType('updateCheck')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        isLoading.addLoading('updateCheck');
        axios
            .put(baseUrl + `check-assignment/${store.check_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getCheck();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateCheck');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message[0], 'error');
                isLoading.removeLoading('updateCheck');
            });
    }

    function updateCheckList() {
        const group_id = router.currentRoute.value.params.group_id;
        const assignment_id = router.currentRoute.value.params.assignment_id;
        const token = localStorage.getItem('token');
        isLoading.addLoading('updateCheckList');
        axios
            .post(
                baseUrl + `assignment/${assignment_id}/check`,
                {
                    group_id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                modal.is_new = false;
                getCheck();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateCheckList');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('updateCheckList');
            });
    }

    function getCheck() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getCheck');
        const assignment_id = router.currentRoute.value.params.assignment_id;
        const group_id = router.currentRoute.value.params.group_id;
        axios
            .get(
                baseUrl +
                    `group/${group_id}/assignment/${assignment_id}/answers?page=${isLoading.store.pagination.current_page}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                console.log(res, 'dksldksldk');
                store.check = res.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getCheck');
            })
            .catch((err) => {
                console.log(err);
                isLoading.showMessage(err.response?.data?.message[0], 'error');
                isLoading.checkAuth(err);
                isLoading.removeLoading('getCheck');
            });
    }

    function deleteCheck() {
        if (isLoading.isLoadingType('deleteCheck')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteCheck');
        axios
            .delete(baseUrl + `checks/${store.check_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                getCheck();
                isLoading.removeLoading('deleteCheck');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message[0]);
                isLoading.removeLoading('deleteCheck');
            });
    }

    return { store, modal, create, clearData, updateCheck, getCheck, updateCheckList, deleteCheck };
});
