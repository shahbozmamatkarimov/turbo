import { defineStore } from 'pinia';
import { useLoadingStore, useMemberStore } from '@/stores';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
    const isLoading = useLoadingStore();
    const useMember = useMemberStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        users: [],
        students: [],
        userbyid: {},
        user_id: null,
    });

    const create = reactive({
        password: '',
        password_confirmation: '',
        type: '',
    });

    const modal = reactive({
        create: false,
        type: false,
        delete: false,
        edit: false,
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
    }

    function updateUserPassword() {
        if (isLoading.isLoadingType('updatePassword')) {
            return;
        }
        if (!create.password) {
            return isLoading.showMessage('Iltimos, parolni kiriting', 'warning');
        } else if (create.password.length < 6) {
            return isLoading.showMessage("Parol 6 belgidan kam bo'lmasligi kerak!", 'warning');
        } else if (create.password != create.password_confirmation) {
            return isLoading.showMessage('Tasdiqlash paroli xato!', 'warning');
        }

        const token = localStorage.getItem('token');
        if (isLoading.isLoadingType('updatePassword')) {
            return;
        }
        isLoading.addLoading('updatePassword');
        axios
            .put(baseUrl + `user/change-password/${store.user_id}`, create, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                getUsers();
                modal.create = false;
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('updatePassword');
            })
            .catch((err) => {
                console.log(err);
                isLoading.removeLoading('updatePassword');
                isLoading.showMessage(err.response.data.message, 'error');
            });
    }

    function updateUserType() {
        if (isLoading.isLoadingType('updateUserType')) {
            return;
        }
        const type = create.type;
        const token = localStorage.getItem('token');
        isLoading.addLoading('updateUserType');
        axios
            .put(
                baseUrl + `user/${store.user_id}`,
                {
                    type,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                getUsers();
                modal.type = false;
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('updateUserType');
            })
            .catch((err) => {
                console.log(err);
                isLoading.removeLoading('updateUserType');
                isLoading.showMessage(err.response.data.message, 'error');
            });
    }

    function getUStudents() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getUStudents');
        axios
            .get(baseUrl + `user/student?page=${isLoading.store.pagination.current_page}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.students = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getUStudents');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getUStudents');
            });
    }

    function getUsers(search) {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getUsers');
        if (search == undefined) {
            search = '';
        }
        axios
            .get(baseUrl + `users?page=${isLoading.store.pagination.current_page}?search=${search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.users = res.data.data;
                if (search) {
                    for (let i in isLoading.store.pagination) {
                        isLoading.store.pagination[i] = res.data.meta[i];
                    }
                }
                isLoading.removeLoading('getUsers');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getUsers');
            });
    }

    function getUserById(id) {
        const token = localStorage.getItem('token');
        if (!id) {
            const id = router.currentRoute.value.params.id;
        }
        isLoading.addLoading('getUserById');
        axios
            .get(baseUrl + `user/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                console.log(res, 'user');
                store.userbyid = res.data.data;
                useMember.store.user_id = res.data.data;
                isLoading.removeLoading('getUserById');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getUserById');
            });
    }

    function deleteUserById() {
        if (isLoading.isLoadingType('getUserById')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('getUserById');
        axios
            .delete(baseUrl + `user-delete/${store.user_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                getUsers();
                modal.delete = false;
                isLoading.showMessage("Foydalanuvchi o'chirildi");
                isLoading.removeLoading('getUserById');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('getUserById');
            });
    }

    return { store, clearData, create, updateUserType, modal, updateUserPassword, getUStudents, getUsers, getUserById, deleteUserById };
});
