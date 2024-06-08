import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
import axios from 'axios';

export const usePlanStore = defineStore('plan', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        plans: [],
        planbyid: {},
        plan_id: null,
        role_data: '',
    });

    const create = reactive({
        name: '',
        price: '+998',
        month: '',
        course_access: false,
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

    function createPlan() {
        if (isLoading.isLoadingType('createPlan')) {
            return;
        }
        if (modal.edit) {
            return updatePlan();
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createPlan');
        const course_access = create.course_access ? 1 : 0;
        axios
            .post(
                baseUrl + 'plans',
                { ...create, course_access },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                getPlans();
                modal.create = false;
                isLoading.showMessage("Qo'shildi", 'success');
                isLoading.removeLoading('createPlan');
            })
            .catch((err) => {
                isLoading.showMessage('xatolik yuz berdi!', 'error');
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('createPlan');
            });
    }

    function updatePlan() {
        if (isLoading.isLoadingType('createPlan')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createPlan');
        const course_access = create.course_access ? 1 : 0;
        axios
            .put(
                baseUrl + `plans/${store.plan_id}`,
                { ...create, course_access },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                modal.create = false;
                getPlans();
                isLoading.showMessage("Ma'lumotlar o'zgartirildi", 'success');
                isLoading.removeLoading('createPlan');
            })
            .catch((err) => {
                isLoading.showMessage('xatolik yuz berdi!', 'error');
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('createPlan');
            });
    }

    function getPlans() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getPlans');
        axios
            .get(baseUrl + `plans`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.plans = res.data.data;
                // for (let i in isLoading.store.pagination) {
                //     isLoading.store.pagination[i] = res.data.meta[i];
                // }
                isLoading.removeLoading('getPlans');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getPlans');
            });
    }

    function deletePlan() {
        if (isLoading.isLoadingType('PlanDel')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('PlanDel');
        axios
            .delete(baseUrl + `plans/${store.plan_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.delete = false;
                getPlans();
                isLoading.showMessage("Tarifni o'chirildi");
                isLoading.removeLoading('PlanDel');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('PlanDel');
            });
    }

    return { store, create, modal, clearData, createPlan, getPlans, deletePlan };
});
