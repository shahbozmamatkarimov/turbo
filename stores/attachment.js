import { defineStore } from 'pinia';
import { useLoadingStore, useLessonStore, useCoursesStore, useAssignmentsStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useAttachmentsStore = defineStore('attachments', () => {
    const isLoading = useLoadingStore();
    const useLesson = useLessonStore();
    const useCourses = useCoursesStore();
    const useAssignments = useAssignmentsStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        attachments: [],
        attachment_id: null,
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
    });

    const create = reactive({
        file: '',
        lesson_id: '',
    });

    function clearData() {
        // for (let i in create) {
        //     create[i] = '';
        // }
    }

    // function createAttachment() {
    //     // useLesson.create.attachments.push(file);
    //     for (let i of useLesson.create.attachments) {
    //         create.file = i;
    //         createAttachmentFiles();
    //     }
    //     useCourses.getCourseData()
    // }

    function createAttachment() {
        // create.assignment_id = +router.currentRoute.value.params.id;
        if (isLoading.isLoadingType('createAttachment')) {
            return;
        }
        if (modal.edit) {
            return updateAttachment();
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        // create.lesson_id = useAssignments.create.lesson_id;
        for (let i in create) {
            // if (!create.file) {
            //     return isLoading.showMessage(i + ' is empty', 'warning');
            // }
            formData.append(i, create[i]);
        }

        isLoading.addLoading('createAttachment');
        axios
            .post(baseUrl + `attachments`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createAttachment');
                // getAttachments();
                useCourses.getCourseData();
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data?.message[0], 'error');
                isLoading.removeLoading('createAttachment');
            });
    }

    function updateAttachment() {
        if (isLoading.isLoadingType('updateAttachment')) {
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
        isLoading.addLoading('updateAttachment');
        axios
            .put(baseUrl + `attachments/${store.attachment_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                // getAttachments();
                useCourses.getCourseData();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateAttachment');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('updateAttachment');
            });
    }

    function getAttachments() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getAttachments');
        const assignment_id = router.currentRoute.value.params.id;
        axios
            .get(baseUrl + `assignment/${assignment_id}/attachments?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.store.isLogged = true;
                store.attachments = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getAttachments');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getAttachments');
            });
    }

    function deleteAttachment() {
        if (isLoading.isLoadingType('deleteAttachment')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteAttachment');
        axios
            .delete(baseUrl + `attachments/${store.attachment_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                // getAttachments();
                // useLesson.getLessonById();
                useCourses.modal.delete = false;
                useCourses.getCourseData();
                isLoading.removeLoading('deleteAttachment');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0]);
                isLoading.removeLoading('deleteAttachment');
            });
    }

    return { store, modal, create, clearData, getAttachments, createAttachment, deleteAttachment };
});
