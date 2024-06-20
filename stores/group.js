import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useGroupStore = defineStore('group', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        group: [],
        trash_group: [],
        group_members: [],
        group_assignments: [],
        group_id: null,
        course_id: null,
        is_delete: false,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
        remove_archive: false,
    });

    const create = reactive({
        name: '',
        max_users: '',
        hour: [],
        is_primary: false,
        course_id: null,
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
        create.hour = [];
        create.is_primary = false;
    }

    function createGroup() {
        create.course_id = store.course_id.id;
        if (isLoading.isLoadingType('createGroup')) {
            return;
        }
        if (modal.edit) {
            return updateGroup();
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
        formData.append('is_primary', create.is_primary ? 1 : 0);

        isLoading.addLoading('createGroup');
        axios
            .post(baseUrl + `groups`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createGroup');
                getGroup();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message[0], 'error');
                isLoading.removeLoading('createGroup');
            });
    }

    function updateGroup() {
        if (isLoading.isLoadingType('updateGroup')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            if (i == 'hour') {
                formData.append('hour', create.hour.join(':'));
            } else {
                formData.append(i, create[i]);
            }
        }
        formData.append('is_primary', create.is_primary ? 1 : 0);
        isLoading.addLoading('updateGroup');
        axios
            .put(baseUrl + `groups/${store.group_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getGroup();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateGroup');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('updateGroup');
            });
    }

    function getGroup() {
        if (store.is_delete) {
            return getTrashGroup();
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('getGroup');
        axios
            .get(baseUrl + `groups?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.store.isLogged = true;
                store.group = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getGroup');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getGroup');
            });
    }

    function getTrashGroup() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getGroup');
        axios
            .get(baseUrl + `group-archive?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.store.isLogged = true;
                store.group = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getGroup');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getGroup');
            });
    }

    function getGroupMembers() {
        const group_id = router.currentRoute.value.params.group_id;
        const token = localStorage.getItem('token');
        isLoading.addLoading('getGroupMembers');
        axios
            .get(baseUrl + `group/${group_id}/members?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.store.isLogged = true;
                store.group_members = res.data;
                isLoading.removeLoading('getGroupMembers');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getGroupMembers');
            });
    }

    function getGroupAssignments() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getGroupAssignments');
        const group_id = router.currentRoute.value.params.group_id;
        axios
            .get(baseUrl + `group/${group_id}/assignments?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.group_assignments = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getGroupAssignments');
            })
            .catch((err) => {
                console.log(err);
                store.group_assignments = [];
                isLoading.checkAuth(err);
                isLoading.removeLoading('getGroupAssignments');
            });
    }

    function restoreGroup() {
        if (isLoading.isLoadingType('deleteGroup')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteGroup');
        axios
            .post(
                baseUrl + `groups-restore/${store.group_id}`,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                isLoading.showMessage('Updated successfully');
                modal.remove_archive = false;
                getTrashGroup();
                isLoading.removeLoading('deleteGroup');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message);
                isLoading.removeLoading('deleteGroup');
            });
    }

    function deleteGroup() {
        if (isLoading.isLoadingType('deleteGroup')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteGroup');
        axios
            .delete(baseUrl + `groups/${store.group_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Archived successfully');
                modal.delete = false;
                getGroup();
                isLoading.removeLoading('deleteGroup');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message?.errors[0]);
                isLoading.removeLoading('deleteGroup');
            });
    }

    function deleteArchiveGroup() {
        if (isLoading.isLoadingType('deleteGroup')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteGroup');
        axios
            .delete(baseUrl + `groups-delete/${store.group_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                getTrashGroup();
                isLoading.removeLoading('deleteGroup');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message?.errors[0]);
                isLoading.removeLoading('deleteGroup');
            });
    }

    return {
        store,
        modal,
        create,
        clearData,
        getGroup,
        getGroupAssignments,
        deleteArchiveGroup,
        getTrashGroup,
        restoreGroup,
        getGroupMembers,
        createGroup,
        deleteGroup,
    };
});
