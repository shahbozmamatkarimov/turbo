import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useMemberStore = defineStore('member', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        member: [],
        member_members: [],
        member_assignments: [],
        member_id: null,
        user_id: null,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
    });

    const create = reactive({
        user_id: '',
        group_id: '',
        is_capitan: false,
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
        create.hour = [];
        create.is_capitan = false;
    }

    function createMember() {
        console.log(store.user_id, 'dls;ds')
        create.user_id = store.user_id?.id;
        create.group_id = router.currentRoute.value.params.group_id;
        if (isLoading.isLoadingType('createMember')) {
            return;
        }
        if (modal.edit) {
            return updateMember();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (let i in create) {
            if (i == 'hour') {
                formData.append('hour', create.hour.join(':'));
            } else {
                formData.append(i, create[i]);
            }
        }
        formData.append('is_capitan', create.is_capitan ? 1 : 0);

        isLoading.addLoading('createMember');
        axios
            .post(baseUrl + `group-members`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createMember');
                getMember();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message[0], 'error');
                isLoading.removeLoading('createMember');
            });
    }

    function updateMember() {
        if (isLoading.isLoadingType('updateMember')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        formData.append('is_capitan', create.is_capitan ? 1 : 0);
        isLoading.addLoading('updateMember');
        axios
            .put(baseUrl + `group-members/${store.member_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getMember();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateMember');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('updateMember');
            });
    }

    function getMember() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getMember');
        const group_id = router.currentRoute.value.params.group_id;
        axios
            .get(baseUrl + `group/${group_id}/members?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                console.log(res);
                isLoading.store.isLogged = true;
                store.member = res.data;
                // for (let i in isLoading.store.pagination) {
                //     isLoading.store.pagination[i] = res.data.meta[i];
                // }
                isLoading.removeLoading('getMember');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getMember');
            });
    }

    function deleteMember() {
        if (isLoading.isLoadingType('deleteMember')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteMember');
        axios
            .delete(baseUrl + `group-members/${store.member_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                getMember();
                isLoading.removeLoading('deleteMember');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message[0]);
                isLoading.removeLoading('deleteMember');
            });
    }

    return { store, modal, create, clearData, getMember, createMember, deleteMember };
});
