<template>
    <footer class="flex flex-col-reverse justify-between rounded-md bg-white px-2 py-2 md:flex-row md:flex-wrap-reverse md:items-center">
        <div class="flex items-center gap-[14px]">
            <p
                @click="changePage('dec')"
                :class="isLoading.store.pagination.current_page == 1 ? 'pointer-events-none opacity-40' : ''"
                class="flex cursor-pointer items-center gap-2 text-sm"
            >
                <img src="@/assets/svg/page_arrow.svg" alt="" />
                Oldingi
            </p>
            <client-only>
                <config-provider :theme="dark">
                    <a-pagination
                        v-model:current="isLoading.store.pagination.current_page"
                        v-model:pageSize="isLoading.store.pagination.per_page"
                        :total="isLoading.store.pagination.total"
                        @change="handleCurrentChange"
                    />
                </config-provider>
            </client-only>
            <p
                @click="changePage('inc')"
                :class="isLoading.store.pagination.current_page == isLoading.store.pagination.last_page ? 'pointer-events-none opacity-40' : ''"
                class="flex cursor-pointer items-center gap-2 text-sm"
            >
                Keyingi
                <img class="rotate-180" src="@/assets/svg/page_arrow.svg" alt="" />
            </p>
        </div>
        <div class="mb-3 ml-auto md:mb-0">
            <p>{{ isLoading.store.pagination.from }}-{{ isLoading.store.pagination.to }} of {{ isLoading.store.pagination.total }}</p>
        </div>
    </footer>
</template>

<script setup>
    import {
        useLoadingStore,
        useWordStore,
        usePhrasesStore,
        useCoursesStore,
        useUserStore,
        useStaffStore,
        useRoleStore,
        usePlanStore,
        usePlanOptionStore,
        useGroupStore,
        useAssignmentsStore,
    } from '@/stores';

    const isLoading = useLoadingStore();
    const useWord = useWordStore();
    const usePhrases = usePhrasesStore();
    const useCourses = useCoursesStore();
    const useUser = useUserStore();
    const useStaff = useStaffStore();
    const useRole = useRoleStore();
    const usePlan = usePlanStore();
    const usePlanOption = usePlanOptionStore();
    const useGroup = useGroupStore();
    const useAssignments = useAssignmentsStore();

    const router = useRouter();
    isLoading.store.pagination.current = router.currentRoute.value.query.page;
    function changePage(type) {
        if (type == 'dec') {
            if (isLoading.store.pagination.current_page == 1) {
                return;
            }
            isLoading.store.pagination.current_page -= 1;
        } else if (type == 'inc') {
            if (isLoading.store.pagination.current_page == isLoading.store.pagination.last_page) {
                return;
            } else {
                isLoading.store.pagination.current_page += 1;
            }
        } else {
            isLoading.store.pagination.current_page = type;
        }
        isLoading.changeQuery('page', isLoading.store.pagination.current_page);

        if (isLoading.store.page_name == 'words') {
            useWord.getWords();
        } else if (isLoading.store.page_name == 'phrase_category') {
            usePhrases.getCategories();
        } else if (isLoading.store.page_name == 'phrases') {
            usePhrases.getPhrases();
        } else if (isLoading.store.page_name == 'courses') {
            useCourses.getCourses();
        } else if (isLoading.store.page_name == 'students') {
            useUser.getUStudents();
        } else if (isLoading.store.page_name == 'staff') {
            useStaff.getStaffs();
        } else if (isLoading.store.page_name == 'roles') {
            useRole.getRoles();
        } else if (isLoading.store.page_name == 'plan') {
            usePlan.getPlans();
        } else if (isLoading.store.page_name == 'plan_option') {
            usePlanOption.getPlanOptions();
        } else if (isLoading.store.page_name == 'users') {
            useUser.getUsers();
        } else if (isLoading.store.page_name == 'group') {
            useGroup.getGroup();
        } else if (isLoading.store.page_name == 'assignments') {
            useAssignments.getAssignments();
        } else if (isLoading.store.page_name == 'group_assignments') {
            useGroup.getGroupAssignments();
        }
    }

    const handleCurrentChange = (val) => {
        changePage(val);
    };
</script>

<style lang="scss" scoped>
    .ul li {
        cursor: pointer;
    }
</style>
