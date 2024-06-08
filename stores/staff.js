import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
import axios from 'axios';

export const useStaffStore = defineStore('staff', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        staffs: [],
        staffbyid: {},
        staff_id: null,
        role_data: '',
    });

    const create = reactive({
        name: '',
        phone: '+998',
        password: '',
        password_confirmation: '',
        role_id: '',
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
        role_management: false,
    });

    function clearData() {
        for (let i in create) {
            create[i] = '';
        }
        create.phone = '+998';
    }

    function createStaff() {
        if (isLoading.isLoadingType('createStaff')) {
            return;
        }
        create.role_id = store.role_data.id;
        create.phone = create.phone.split('-').join('');
        const phone = create.phone?.slice(1, 4);
        if (phone !== '998' || create.phone.length != 13) {
            return isLoading.showMessage("Iltimos, raqamni to'g'ri kiriting", 'warning');
        }
        if (modal.edit) {
            return updateStaff();
        }

        if (!create.password) {
            return isLoading.showMessage('Iltimos, parolni kiriting', 'warning');
        } else if (create.password.length < 6) {
            return isLoading.showMessage("Parol 6 belgidan kam bo'lmasligi kerak!", 'warning');
        } else if (create.password != create.password_confirmation) {
            return isLoading.showMessage('Tasdiqlash paroli xato!', 'warning');
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createStaff');
        axios
            .post(baseUrl + 'staff', create, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                getStaffs();
                modal.create = false;
                isLoading.showMessage("Xodim qo'shildi", 'success');
                isLoading.removeLoading('createStaff');
            })
            .catch((err) => {
                isLoading.showMessage('xatolik yuz berdi!', 'error');
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('createStaff');
            });
    }

    function updateStaff() {
        if (isLoading.isLoadingType('createStaff')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createStaff');
        axios
            .put(baseUrl + `staff/${store.staff_id}`, create, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getStaffs();
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('createStaff');
            })
            .catch((err) => {
                isLoading.showMessage('xatolik yuz berdi!', 'error');
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('createStaff');
            });
    }

    function getStaffs() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getStaffs');
        axios
            .get(baseUrl + `staff?page=${isLoading.store.pagination.current_page}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.staffs = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getStaffs');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getStaffs');
            });
    }

    function getStaffById() {
        const token = localStorage.getItem('token');
        const id = router.currentRoute.value.params.id;
        isLoading.addLoading('getStaffById');
        axios
            .get(baseUrl + `staffs/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.staffbyid = res.data.data;
                isLoading.removeLoading('getStaffById');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getStaffById');
            });
    }

    function deleteStaff() {
        if (isLoading.isLoadingType('DeleteStaff')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('DeleteStaff');
        axios
            .delete(baseUrl + `staff/${store.staff_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.delete = false;
                getStaffs();
                isLoading.showMessage("Foydalanuvchi o'chirildi");
                isLoading.removeLoading('DeleteStaff');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0]);
                isLoading.removeLoading('DeleteStaff');
            });
    }

    return { store, create, modal, clearData, createStaff, getStaffs, getStaffById, deleteStaff };
});
