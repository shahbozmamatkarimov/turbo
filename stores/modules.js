import { defineStore } from 'pinia';
import { useLoadingStore, useCoursesStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useModulesStore = defineStore('modules', () => {
    const isLoading = useLoadingStore();
    const useCourses = useCoursesStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        modules: [],
        module_id: null,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
    });

    const create = reactive({
        name: '',
        course_id: '',
    });

    function clearData() {
        create.name = '';
        // for (let i in create) {
        //     create[i] = '';
        // }
    }

    function createModule() {
        create.course_id = router.currentRoute.value.params.course_id
        if (isLoading.isLoadingType('createModule')) {
            return;
        }
        // const course_id = router.currentRoute.value.params.id;
        // create.course_id = course_id;
        if (modal.edit) {
            return updateModule();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (let i in create) {
            formData.append(i, create[i]);
        }
        isLoading.addLoading('createModule');
        axios
            .post(baseUrl + `module`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createModule');
                // getModules();
                clearData();
                useCourses.getCourseData();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('createModule');
            });
    }

    function updateModule() {
        if (isLoading.isLoadingType('updateModule')) {
            return;
        }
        // const course_id = router.currentRoute.value.params.id;
        // create.course_id = course_id;
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        isLoading.addLoading('updateModule');
        axios
            .put(baseUrl + `module/${store.module_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                // getModules();
                clearData();
                useCourses.getCourseData();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateModule');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('updateModule');
            });
    }

    function getModules() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getModules');
        const course_id = router.currentRoute.value.params.id;
        axios
            .get(baseUrl + `course/${course_id}/modules-get?page=` + isLoading.store.pagination.current_page, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.modules = res.data;
                isLoading.removeLoading('getModules');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.removeLoading('getModules');
            });
    }

    function updatePosition() {
        const token = localStorage.getItem('token');
        const data = [];
        for (let i of store.modules) {
            data.push(i.id);
        }
        isLoading.addLoading('updatePosition');
        axios
            .post(
                baseUrl + `modules/update-positions`,
                { module_ids: data },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                    },
                }
            )
            .then((res) => {
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updatePosition');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response?.data?.message, 'error');
                isLoading.removeLoading('updatePosition');
            });
    }

    function deleteModule() {
        if (isLoading.isLoadingType('deleteModule')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteModule');
        axios
            .delete(baseUrl + `module/${store.module_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                console.log(res);
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                useCourses.modal.delete = false;
                useCourses.getCourseData();
                isLoading.removeLoading('deleteModule');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message);
                isLoading.removeLoading('deleteModule');
            });
    }

    return { store, modal, create, clearData, updatePosition, getModules, createModule, deleteModule };
});
