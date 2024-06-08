import { defineStore } from 'pinia';
import { useLoadingStore, useCoursesStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useLessonStore = defineStore('lesson', () => {
    const isLoading = useLoadingStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;
    const useCourses = useCoursesStore();

    const store = reactive({
        lessons: [],
        lesson_data: [],
        lesson_id: null,
        assignment_step: 0,
        attachment_step: 0,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
    });

    const create = reactive({
        title: '',
        module_id: null,
        description: '',
        duration: '',
        video: '',
        assignments: [],
        attachments: [],
    });

    function clearData() {
        // for (let i in create) {
        //     create[i] = '';
        // }
        create.assignments = [];
        create.attachments = [];
        store.assignment_step = 0;
        store.attachment_step = 0;
        // create.module_id = router.currentRoute.value.params.module_id;
        store.lesson_data = [];
    }

    function createLesson() {
        if (!create.attachments) {
            create.attachments = [];
        }
        let file_number = 0;
        if (isLoading.isLoadingType('createLesson')) {
            return;
        }
        // create.module_id = router.currentRoute.value.params.module_id;
        if (modal.edit) {
            return updateLesson();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (let i in create) {
            if (!create[i] && create[i] != 0) {
                return isLoading.showMessage(i + ' is empty', 'warning');
            }
            if (i != 'assignments') {
                formData.append(i, create[i]);
            }
        }
        if (create.assignments?.length) {
            for (let i of create.assignments) {
                if (!i.name || !i.max_score || !i.description) {
                    isLoading.showMessage("Ma'lumotlarni to'liq kiriting", 'warning');
                    return;
                }
            }
            formData.append('assignments', JSON.stringify(create.assignments));
        }
        for (let i = 1; i <= create.attachments.length; i++) {
            formData.append(`file${i}`, create.attachments[i - 1]);
            file_number += 1;
        }
        formData.append('file_number', file_number);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`, '----4');
        }

        isLoading.addLoading('createLesson');
        axios
            .post(baseUrl + `lesson`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createLesson');
                // getLessons();
                useCourses.getCourseData();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0], 'error');
                isLoading.removeLoading('createLesson');
            });
    }

    function updateLesson() {
        let file_number = 0;
        if (isLoading.isLoadingType('updateLesson')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        // const formData = new URLSearchParams();

        for (let i in create) {
            // if (!create[i] && create[i] != 0 && i != 'attachments') {
            //     return isLoading.showMessage(i + ' is empty', 'warning');
            // }
            if (i != 'assignments') {
                formData.append(i, create[i]);
            }
        }
        if (create.assignments?.length) {
            for (let i of create.assignments) {
                if (!i.name || !i.max_score || !i.description) {
                    isLoading.showMessage("Ma'lumotlarni to'liq kiriting", 'warning');
                    return;
                }
            }
            formData.append('assignments', JSON.stringify(create.assignments));
        }
        for (let i = 1; i <= create.attachments.length; i++) {
            formData.append(`file${i}`, create.attachments[i - 1]);
            file_number += 1;
        }
        formData.append('file_number', file_number);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`, '----4');
        }
        isLoading.addLoading('updateLesson');
        axios
            .post(baseUrl + `lesson/${store.lesson_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                getLessons();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateLesson');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('updateLesson');
            });
    }

    function getLessons() {
        const module_id = router.currentRoute.value.params.module_id;
        const course_id = router.currentRoute.value.params.id;
        const token = localStorage.getItem('token');
        isLoading.addLoading('getLessons');
        axios
            .get(baseUrl + `course/${course_id}/module/${module_id}/lessons`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.lessons = res.data;
                // for (let i in isLoading.store.pagination) {
                //     isLoading.store.pagination[i] = res.data.meta[i];
                // }
                isLoading.removeLoading('getLessons');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getLessons');
            });
    }

    function getLessonById() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getLessonById');
        axios
            .get(baseUrl + `lesson/${store.lesson_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                store.lesson_data = res.data;
                isLoading.removeLoading('getLessonById');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getLessonById');
            });
    }

    function deleteLesson() {
        if (isLoading.isLoadingType('deleteLesson')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteLesson');
        axios
            .delete(baseUrl + `lesson/${store.lesson_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                getLessons();
                isLoading.removeLoading('deleteLesson');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message);
                isLoading.removeLoading('deleteLesson');
            });
    }

    return { store, modal, create, clearData, getLessons, getLessonById, createLesson, deleteLesson };
});
