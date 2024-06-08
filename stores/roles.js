import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
import axios from 'axios';

export const useRoleStore = defineStore('role', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        roles: [],
        rolebyid: {},
        role_id: null,
        permissions: {},
        permissions_for_user: {},
    });

    const create = reactive({
        name: '',
        permissions: [],
    });

    const modal = reactive({
        read: false,
        create: false,
        delete: false,
        edit: false,
        role_management: false,
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
        for (let i of Object.keys(store.permissions)) {
            store.permissions_for_user[i] = [];
            for (let _ of store.permissions[i]) {
                store.permissions_for_user[i].push(false);
            }
        }
    }

    function createRole() {
        if (isLoading.isLoadingType('createRole')) {
            return;
        }
        create.permissions = [];

        for (let i of Object.keys(store.permissions_for_user)) {
            for (let j in store.permissions_for_user[i]) {
                if (store.permissions_for_user[i][j]) {
                    create.permissions.push(store.permissions[i][j]);
                }
            }
        }
        if (modal.edit) {
            return updateRole();
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createRole');
        axios
            .post(baseUrl + 'role', create, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                getRoles();
                modal.create = false;
                isLoading.showMessage("Rol qo'shildi", 'success');
                isLoading.removeLoading('createRole');
            })
            .catch((err) => {
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('createRole');
            });
    }

    function updateRole() {
        if (isLoading.isLoadingType('createRole')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createRole');
        axios
            .put(baseUrl + `role/${store.role_id}`, create, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                if (res.data.message == 'Role with this name already exists.') {
                    isLoading.showMessage('Rol allaqachon yaratilgan!', 'warning');
                    return;
                }
                modal.create = false;
                getRoles();
                isLoading.showMessage("Rol o'zgartirildi", 'success');
                isLoading.removeLoading('createRole');
            })
            .catch((err) => {
                isLoading.showMessage('xatolik yuz berdi!', 'error');
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('createRole');
            });
    }

    function getRoles() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getRoles');
        axios
            .get(baseUrl + 'role', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.roles = res.data;
                isLoading.removeLoading('getRoles');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getRoles');
            });
    }

    function getPermissions() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getPermissions');
        axios
            .get(baseUrl + 'permissions', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                // view, create, edit, delete;
                store.permissions = {};
                store.permissions_for_user = {};
                store.permissions = res.data;
                for (let i of Object.keys(res.data)) {
                    store.permissions_for_user[i] = [];
                    for (let _ of res.data[i]) {
                        store.permissions_for_user[i].push(false);
                    }
                }
                isLoading.removeLoading('getPermissions');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getPermissions');
            });
    }

    function getRoleById() {
        const token = localStorage.getItem('token');
        const id = router.currentRoute.value.params.id;
        isLoading.addLoading('getRoleById');
        axios
            .get(baseUrl + `roles/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.rolebyid = res.data.data;
                isLoading.removeLoading('getRoleById');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getRoleById');
            });
    }

    function deleteRole() {
        if (isLoading.isLoadingType('DeleteRole')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('DeleteRole');
        axios
            .delete(baseUrl + `role/${store.role_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.delete = false;
                getRoles();
                isLoading.showMessage("Rol o'chirildi");
                isLoading.removeLoading('DeleteRole');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message);
                isLoading.removeLoading('DeleteRole');
            });
    }

    return { store, create, modal, clearData, createRole, getRoles, getPermissions, getRoleById, deleteRole };
});
