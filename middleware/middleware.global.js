import { defineNuxtRouteMiddleware } from '#app';
import { useLoadingStore, useCoursesStore } from '@/stores';
// import { useRouter } from 'vue-router';
export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLoading = useLoadingStore();
    const useCourses = useCoursesStore();
    
    try {
        if (process.client) {
            const token = localStorage.getItem('token');
            if (!token) {
                if (to.name != 'login') {
                    navigateTo('/login');
                }
            } else {
                if (to.name != 'login' && !isLoading.store.isLogged) {
                    useCourses.getCourses();
                }
            }
        }
        // isLoading.store.isLogged = true;

    } catch (error) {
        if (to.name != 'login') {
            navigateTo('/login');
        }
        isLoading.store.isLogin = false;
        // isLoading.store.isLogged = true;
    }
});
