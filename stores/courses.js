import { defineStore } from 'pinia';
import { useLoadingStore, useLessonStore, useGroupStore } from '@/stores';
// import { useNotification } from '@/composables';
import axios from 'axios';

export const useCoursesStore = defineStore('courses', () => {
    const isLoading = useLoadingStore();
    const useLesson = useLessonStore();
    const useGroup = useGroupStore();
    const runtime = useRuntimeConfig();
    const router = useRouter();
    const baseUrl = runtime.public.baseURL;

    const store = reactive({
        courses: [],
        coursebyid: [],
        course_data: [],
        course_id: null,
        duration: [],
    });

    const modal = reactive({
        create: false,
        delete: false,
        edit: false,
    });

    const create = reactive({
        name: null,
        description: null,
        excerpt: null,
        trailer: null,
        image: null,
        duration: null,
        price: null,
        discount: null,
        month_number: null,
        suffix: null,
        max_students: null,
        level: null,
        course_type: null,
        learn: null,
        audience: null,
        materials: null,
        requirements: null,
    });

    function clearData() {
        for (let i in create) {
            create[i] = null;
        }
        store.duration = [];
    }

    function createCourse() {
        for (let i in create) {
            if (!create[i] && create[i] != 0) {
                delete create[i];
            }
        }
        create.duration = store.duration.join(':');
        create.course_type = create.course_type ? 1 : 0;
        if (isLoading.isLoadingType('createCourse')) {
            return;
        }
        // create.created_by = String(isLoading.store.user.id);
        if (modal.edit) {
            return updateCourse();
        }
        // create.created_by = isLoading.user.id;
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (let i in create) {
            formData.append(i, create[i]);
        }
        // formData.append("created_by", isLoading.store.user.id);

        isLoading.addLoading('createCourse');
        axios
            .post(baseUrl + `course`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                isLoading.showMessage('Created successfully', 'success');
                isLoading.removeLoading('createCourse');
                clearData();
                router.push("/courses")
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data?.message[0], 'error');
                isLoading.removeLoading('createCourse');
            });
    }

    function updateCourse() {
        if (isLoading.isLoadingType('updateCourse')) {
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (let i in create) {
            formData.append(i, create[i]);
        }
        isLoading.addLoading('updateCourse');
        axios
            .post(baseUrl + `course/${store.course_id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                modal.create = false;
                clearData();
                isLoading.showMessage('Updated successfully', 'success');
                isLoading.removeLoading('updateCourse');
                router.push("/courses")
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message, 'error');
                isLoading.removeLoading('updateCourse');
            });
    }

    function getCourses() {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getCourses');
        axios
            .get(baseUrl + `course?page=${isLoading.store.pagination.current_page}&search=${isLoading.store.search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.store.isLogged = true;
                store.courses = res.data.data;
                for (let i in isLoading.store.pagination) {
                    isLoading.store.pagination[i] = res.data.meta[i];
                }
                isLoading.removeLoading('getCourses');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getCourses');
            });
    }

    function searchCourses(search) {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getCourses');
        axios
            .get(baseUrl + `course?page=1&search=${search}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                console.log(res);
                isLoading.store.isLogged = true;
                store.courses = res.data.data;
                isLoading.removeLoading('getCourses');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getCourses');
            });
    }

    function getCourseById(id) {
        const token = localStorage.getItem('token');
        isLoading.addLoading('getCourseById');
        axios
            .get(baseUrl + `course/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                console.log(res)
                useGroup.store.course_id = res.data;
                isLoading.removeLoading('getCourseById');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getCourseById');
            });
    }

    function getCourseData() {
        useLesson.modal.create = false;
        const token = localStorage.getItem('token');
        isLoading.addLoading('getCourseData');
        store.course_id = router.currentRoute.value.params.course_id;
        axios
            .get(baseUrl + `course/${store.course_id}/get-all`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                console.log(res);
                for (let i in create) {
                    create[i] = res.data[i];
                }

                
                try {
                    store.duration = res.data.duration.split(':');
                } catch (_) {}
                store.course_data = res.data.modules;
                isLoading.removeLoading('getCourseData');
            })
            .catch((err) => {
                console.log(err);
                isLoading.checkAuth(err);
                isLoading.removeLoading('getCourseData');
            });
    }

    function deleteCourse() {
        if (isLoading.isLoadingType('deleteCourse')) {
            return;
        }
        const token = localStorage.getItem('token');
        isLoading.addLoading('deleteCourse');
        axios
            .delete(baseUrl + `course/${store.course_id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'APP-TOKEN': 'Xw3IMBRkzMLxRm4',
                },
            })
            .then((res) => {
                isLoading.showMessage('Deleted successfully');
                modal.delete = false;
                getCourses();
                isLoading.removeLoading('deleteCourse');
            })
            .catch((err) => {
                isLoading.checkAuth(err);
                console.log(err);
                isLoading.showMessage(err.response.data.message[0]);
                isLoading.removeLoading('deleteCourse');
            });
    }

    return { store, modal, create, clearData, searchCourses, getCourses, getCourseData, createCourse, deleteCourse, getCourseById };
});
