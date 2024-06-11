import { defineStore } from 'pinia';
import { useLoadingStore, useCoursesStore, useLessonStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useAssignmentsStore = defineStore('assignments', () => {
    const isLoading = useLoadingStore();
    const useLesson = useLessonStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;
    const useCourses = useCoursesStore();

    const store = reactive({
        assignments: [],
        assignment_id: null,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
    });

    const create = reactive({
        name: '',
        description: '',
        lesson_id: '',
        max_score: '',
    });

    function clearData() {
        const id = create.lesson_id;
        for (let i in create) {
            create[i] = '';
        }
        create.lesson_id = id;
    }

    function createAssignment() {
        // create.lesson_id = useLesson.store.lesson_id;
        if (isLoading.isLoadingType('createAssignment')) {
            return;
        }
        // create.created_by = String(isLoading.store.user.id);
        if (modal.edit) {
            return updateAssignment();
        }
        // create.created_by = isLoading.user.id;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (let i in create) {
            if (!create[i] && create[i] != 0) {
                return isLoading.showMessage(i + ' is empty', 'warning');
            }
            formData.append(i, create[i]);
        }
        // formData.append("created_by", isLoading.store.user.id);

        isLoading.addLoading('createAssignment');
        axios
            .post(baseUrl + `assignments`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createAssignment');
                clearData();
                useCourses.getCourseData();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data?.message[0], 'error');
                isLoading.removeLoading('createAssignment');
            });
    }

    function updateAssignment() {
        if (isLoading.isLoadingType('updateAssignment')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new URLSearchParams();
        for (let i in create) {
            if (!create[i] && create[i] != 0) {
                if (i != 'image') {
                    return isLoading.showMessage(i + ' is empty', 'warning');
                }
            }
            formData.append(i, create[i]);
        }
        isLoading.addLoading('updateAssignment');
        axios
            .put(baseUrl + `assignments/${store.assignment_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateAssignment');
                clearData()
                useCourses.getCourseData();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('updateAssignment');
            });
    }

    function getAssignments() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getAssignments');
        const lesson_id = router.currentRoute.value.params.lesson_id;
        axios
            .get(baseUrl + `lesson/${lesson_id}/assignments?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.store.isLogged = true;
                store.assignments = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getAssignments');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getAssignments');
            });
    }

    function deleteAssignment() {
        if (isLoading.isLoadingType('deleteAssignment')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteAssignment');
        axios
            .delete(baseUrl + `assignments/${store.assignment_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                useCourses.modal.delete = false;
                useCourses.getCourseData();
                // getAssignments();
                // useLesson.getLessonById();
                isLoading.removeLoading('deleteAssignment');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0]);
                isLoading.removeLoading('deleteAssignment');
            });
    }

    return { store, modal, create, clearData, getAssignments, createAssignment, deleteAssignment };
});
