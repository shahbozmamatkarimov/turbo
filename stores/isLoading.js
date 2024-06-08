import { defineStore } from 'pinia';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores';

export const useLoadingStore = defineStore('loading', () => {
    const runtime = useRuntimeConfig();
    const baseUrl = runtime.public.baseURL;
    const router = useRouter();
    const useAuth = useAuthStore();

    const store = reactive({
        loadingTypes: [],
        page_name: '',
        search: '',
        isLogged: false,
        user: '',
        permissions: [],
        userData: {},
        pagination: {
            current_page: router.currentRoute.value.query.page ? router.currentRoute.value.query.page : 1,
            total: '',
            last_page: 1,
            per_page: '',
            from: '',
            to: '',
        },
    });

    const user = reactive({
        id: '',
    });

    const modal = reactive({
        add_link: false,
        link: '',
    });

    function addLoading(type) {
        if (!store.loadingTypes?.includes(type)) {
            store.loadingTypes.push(type);
        }
    }

    function removeLoading(type) {
        if (store.loadingTypes?.includes(type)) {
            store.loadingTypes = store.loadingTypes?.filter((loading) => loading !== type);
        }
    }

    function isLoadingType(type) {
        return store.loadingTypes?.includes(type);
    }

    function isURL(str) {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }

    function changeQuery(type, query) {
        if (store.page_name == 'group' && type != 'page') {
            router.currentRoute.value.query.page = 1;
        }

        const currentQueries = { ...router.currentRoute.value.query };
        currentQueries[type] = query;
        let url = '?';
        let t = 0;
        for (let i in currentQueries) {
            if (currentQueries[i]) {
                if (t) {
                    url += '&';
                }
                url += `${i}=${currentQueries[i]}`;
                t++;
            }
        }
        router.push(url);
    }

    function checkAuth(err) {
        if (err.response?.data?.message == 'Permission Denied.') {
            showMessage("Sizga ruxsat yo'q!", 'warning');
        } else if (err.response?.status == 401) {
            router.push('/login');
        }
    }

    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    function checkRole() {
        const roles = ['Super Admin', 'Owner'];
        if (roles.includes(useAuth.store.userData?.type)) {
            return true;
        }
        return false;
    }

    function phoneMask(phoneNumber) {
        if (phoneNumber.startsWith('+')) {
            phoneNumber = '+' + phoneNumber.replace(/\D/g, '');
        } else {
            phoneNumber = '+' + phoneNumber;
            phoneNumber = '+' + phoneNumber.replace(/\D/g, '');
        }

        const spacePositions = [4, 7, 11, 14];

        // Insert spaces at specified positions
        for (var i = 0; i < spacePositions.length; i++) {
            if (phoneNumber.length > spacePositions[i]) {
                phoneNumber = phoneNumber?.slice(0, spacePositions[i]) + '-' + phoneNumber?.slice(spacePositions[i]);
            }
        }

        // Update the input value
        return phoneNumber?.slice(0, 17);
    }

    return {
        user,
        store,
        modal,
        addLoading,
        removeLoading,
        isLoadingType,
        changeQuery,
        isURL,
        showMessage,
        checkAuth,
        checkRole,
        phoneMask,
    };
});
