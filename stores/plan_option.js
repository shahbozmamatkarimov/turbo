import { defineStore } from 'pinia';
import { useLoadingStore } from '@/stores';
import axios from 'axios';

export const usePlanOptionStore = defineStore('planoption', () => {
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
        plan_id: +router.currentRoute.value.params.plan_id,
        is_included: false,
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

    function createPlanOption() {
        if (isLoading.isLoadingType('createPlan')) {
            return;
        }
        create.plan_id = +router.currentRoute.value.params.plan_id;
        if (modal.edit) {
            return updatePlanOption();
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createPlan');
        const is_included = create.is_included ? 1 : 0;
        axios
            .post(
                baseUrl + 'plan/option',
                { ...create, is_included },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                getPlanOptions();
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

    function updatePlanOption() {
        if (isLoading.isLoadingType('createPlan')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('createPlan');
        const is_included = create.is_included ? 1 : 0;
        axios
            .put(
                baseUrl + `plan/option/${store.plan_id}`,
                { ...create, is_included },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                modal.create = false;
                getPlanOptions();
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

    function getPlanOptions() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getPlanOptions');
        axios
            .get(baseUrl + `plan/option`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.plans = res.data;
                // for (let i in isLoading.store.pagination) {
                //     isLoading.store.pagination[i] = res.data.meta[i];
                // }
                isLoading.removeLoading('getPlanOptions');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getPlanOptions');
            });
    }

    function deletePlanOption() {
        if (isLoading.isLoadingType('PlanDelete')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('PlanDelete');
        axios
            .delete(baseUrl + `plan/option/${store.plan_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.delete = false;
                getPlanOptions();
                isLoading.showMessage("Tarifni o'chirildi");
                isLoading.removeLoading('PlanDelete');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('PlanDelete');
            });
    }

    return { store, create, modal, clearData, createPlanOption, getPlanOptions, deletePlanOption };
});
