import { defineStore } from 'pinia';
import { useLoadingStore, useAppStore } from '@/stores';
import { useRouter } from 'vue-router';
import { sidebar } from '@/constants/sidebar';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
    const appStore = useAppStore();
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        errorMessage: '',
        edit_username: false,
        edit_password: false,
        userData: {
            name: '',
            last_name: '',
            phone: '',
            type: '',
        },
    });

    const modal = reactive({
        login: false,
        register: false,
    });

    const verify = reactive({
        email: '',
        verify_code: '',
    });

    const login = reactive({
        phone: '+998',
        password: '',
    });

    const edit_username = reactive({
        name: '',
        last_name: '',
    });

    const edit_password = reactive({
        password: '',
        password_confirmation: '',
        current_password: '',
    });

    const register = reactive({
        name: '',
        surname: '',
        email: '',
        password: '',
        user_bio: 'null',
        address: '',
    });

    function authLogin() {
        login.phone = login.phone.split('-').join('');
        const phone = login.phone?.slice(1, 4);
        if (phone !== '998' || login.phone.length != 13) {
            return isLoading.showMessage("Iltimos, raqamni to'g'ri kiriting", 'warning');
        }
        if (isLoading.isLoadingType('logging')) {
            return;
        }
        isLoading.addLoading('logging');
        axios
            .post(baseUrl + 'login', login, {
                headers: {
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                if (res.status == 200) {
                    store.userData = res.data.user;
                    isLoading.store.userData = res.data.user;
                    if (store.userData.type == 'Student') {
                        isLoading.showMessage("Sizga ruxsat yo'q", 'error');
                        return;
                    }
                    localStorage.setItem('token', res.data?.authorization?.token);
                    isLoading.store.isLogin = true;
                    store.errorMessage = '';
                    isLoading.showMessage('Kirish muvaffaqiyatli amalga oshirildi!', 'success');
                    // router.push('/dictionary');
                    window.location.href = '/dictionary';
                } else {
                    isLoading.showMessage('Xatolik yuz berdi!', 'error');
                    store.errorMessage = res?.data.message;
                }
                isLoading.removeLoading('logging');
            })
            .catch((err) => {
                isLoading.showMessage(err.response?.data?.message[0], 'error');
                isLoading.removeLoading('logging');
            });
    }

    function authRegister() {
        if (isLoading.isLoadingType('register')) {
            return;
        }
        isLoading.addLoading('register');
        axios
            .post(baseUrl + 'register', register)
            .then((res) => {
                if (res.data?.code == 200) {
                    store.errorMessage = '';
                    router.push('/auth/verify_email');
                } else {
                    isLoading.showMessage(res.data.message, 'error');
                    store.errorMessage = res.data.message;
                }
                isLoading.removeLoading('register');
            })
            .catch((err) => {
                isLoading.showMessage(err.response.data.message, 'error');

                console.log(err);
                store.errorMessage = res.data.message;
                isLoading.removeLoading('register');
            });
    }

    function updateUsername() {
        const token = localStorage.getItem('token');
        if (isLoading.isLoadingType('updateUsername')) {
            return;
        }
        isLoading.addLoading('updateUsername');
        axios
            .put(baseUrl + 'user', edit_username, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                getUser();
                store.edit_username = false;
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('updateUsername');
            })
            .catch((err) => {
                isLoading.showMessage('Xatolik yuz berdi', 'error');

                console.log(err);
                store.errorMessage = res.data.message;
                isLoading.removeLoading('updateUsername');
            });
    }

    function updatePassword() {
        if (!edit_password.current_password) {
            return isLoading.showMessage('Iltimos, parolni kiriting', 'warning');
        } else if (edit_password.current_password.length < 6 || edit_password.password?.length < 6) {
            return isLoading.showMessage("Parol 6 belgidan kam bo'lmasligi kerak!", 'warning');
        } else if (edit_password.password != edit_password.password_confirmation) {
            return isLoading.showMessage('Tasdiqlash paroli xato!', 'warning');
        }

        if (edit_password.password == edit_password.current_password) {
            return isLoading.showMessage('Iltimos, yangi parol kiriting!', 'warning');
        }
        const token = localStorage.getItem('token');
        if (isLoading.isLoadingType('updatePassword')) {
            return;
        }
        isLoading.addLoading('updatePassword');
        axios
            .put(baseUrl + 'change-password', edit_password, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                getUser();
                store.edit_password = false;
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('updatePassword');
            })
            .catch((err) => {
                isLoading.removeLoading('updatePassword');
                if (err.response.data.message == 'Current password is incorrect') {
                    isLoading.showMessage('Eski parol xato', 'error');
                    return;
                }
                isLoading.showMessage('Xatolik yuz berdi', 'error');

                console.log(err);
                store.errorMessage = res.data.message;
            });
    }

    function getUser() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getUser');
        appStore.isShowMainLoader = false;

        axios
            .get(baseUrl + 'getMe', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                try {
                    store.userData = res.data?.data;
                    isLoading.store.userData = res.data?.data;
                    const permissions = res.data?.permissions;
                    isLoading.store.permissions = [];
                    for (let i in permissions) {
                        isLoading.store.permissions.push(...permissions[i]);
                    }
                    if (isLoading.store.user.type == 'Student') {
                        router.push('/login');
                    }
                    let step = 0;
                    for (let i of sidebar) {
                        if (i.type == 'accordion') {
                            let child_step = 0;
                            for (let child of i.child) {
                                if (permissions[child.name]?.toString().includes('View')) {
                                    sidebar[step].child[child_step].role = true;
                                }
                                child_step++;
                            }
                        } else {
                            if (permissions[i.name]?.toString().includes('View')) {
                                sidebar[step].role = true;
                            }
                        }
                        step++;
                    }
                    isLoading.removeLoading('getUser');
                    appStore.isShowMainLoader = false;
                } catch (err) {
                    console.log(err);
                }
            })
            .catch((err) => {
                console.log(err);
                appStore.isShowMainLoader = false;
                isLoading.removeLoading('getUser');
                router.push('/login');
            });
    }

    return { store, modal, verify, login, edit_username, edit_password, register, updateUsername, updatePassword, authLogin, authRegister, getUser };
});
