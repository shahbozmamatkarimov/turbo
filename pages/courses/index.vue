<template>
    <div v-loading="isLoading.isLoadingType('getCourses')" class="panel">
        <!-- <div class="panel"> -->
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Kurslar</h5>
            <div class="flex">
                <div v-if="isLoading.store.permissions?.includes('Create Course')" class="flex items-center justify-center">
                    <button type="button" class="btn btn-info" @click="$router.push('courses/course/create')">+ Qo'shish</button>
                </div>
                <div class="ml-4 flex rounded-md bg-[#027DFC1A] duration-1000">
                    <button
                        @click="useCourses.store.is_delete = false"
                        :class="useCourses.store.is_delete ? '' : 'bg-[#027DFC] text-white'"
                        class="flex h-9 w-9 items-center justify-center rounded-md duration-700"
                    >
                        <icon-box />
                    </button>
                    <button
                        @click="useCourses.store.is_delete = true"
                        :class="!useCourses.store.is_delete ? '' : 'bg-[#027DFC] text-white'"
                        class="flex h-9 w-9 items-center justify-center rounded-md duration-700"
                    >
                        <icon-refresh />
                    </button>
                </div>
            </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <template v-for="data in useCourses.store.courses" :key="data.id">
                <div class="flex cursor-pointer items-center justify-center">
                    <div
                        class="relative w-full max-w-[22rem] rounded border border-[#e0e6ed] bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none"
                    >
                        <div class="px-6 py-7 pb-[60px]">
                            <div @click="$router.push(`courses/${data.id}/edit`)">
                                <div class="-mx-6 -mt-7 mb-2 h-[200px] overflow-hidden rounded-tl rounded-tr">
                                    <img v-if="data.photo" :src="data.photo" alt="" class="min-h-[200px] w-full object-cover" />
                                    <img v-else src="@/assets/image/placeholder.svg" alt="" class="min-h-[200px] w-full object-cover" />
                                </div>
                                <p class="mb-1 text-xs font-bold text-primary">{{ formateCreatedAt(data.created_at) }}</p>
                                <h5 class="mb-2 h-4 truncate text-[15px] font-bold text-[#3b3f5c] dark:text-white-light">
                                    {{ data.name }}
                                </h5>
                                <p class="line-clamp-3 h-[64px] text-white-dark" v-html="data.description"></p>
                                <p class="mt-5">Qisqa ma'lumot</p>
                                <p class="line-clamp-2 h-10 text-white-dark" v-html="data.excerpt"></p>
                                <ul class="mb-2 mt-3 dark:text-gray-200">
                                    <li class="flex justify-between">
                                        Davomiyligi:
                                        <p>{{ data.duration }}</p>
                                    </li>
                                    <li class="flex justify-between">
                                        Oy:
                                        <p>{{ data.month_number }}</p>
                                    </li>
                                </ul>
                                <div
                                    class="relative flex justify-between pt-4 before:absolute before:inset-x-0 before:top-0 before:mx-auto before:h-[1px] before:w-[250px] before:bg-[#e0e6ed] dark:before:bg-[#1b2e4b]"
                                >
                                    <div class="flex items-center font-semibold">
                                        <div class="inline-block h-9 w-9 shrink-0 overflow-hidden rounded-full ltr:mr-2 rtl:ml-2.5">
                                            <span class="flex h-full w-full items-center justify-center bg-[#515365] text-[#e0e6ed]"></span>
                                        </div>
                                        <div class="text-[#515365] dark:text-white-dark"></div>
                                    </div>
                                    <div class="flex font-semibold">
                                        <div class="flex items-center text-primary">
                                            <div class="flex items-center text-primary ltr:mr-3 rtl:ml-3">
                                                <icon-dollar-sign class="h-4 w-4 ltr:mr-1 rtl:ml-1" />
                                                <p class="mr-2 line-through" v-if="data.discount">{{ data.price + data.discount }}</p>
                                                {{ data.price }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <li class="mt-3 flex justify-between">
                                Link:
                                <p class="flex gap-2">
                                    <a class="max-w-[120px] truncate" target="_blank" :href="data.trailer">{{ data.trailer ? data.trailer : '_____' }}</a>
                                    <icon-logout />
                                </p>
                            </li>
                        </div>
                        <ul class="absolute bottom-3 right-4 flex items-center justify-center gap-3 py-2">
                            <ul v-if="isLoading.store.permissions?.includes('Edit Course')">
                                <li v-if="useCourses.store.is_delete" @click="handleRemoveArchive(data.id) && isLoading.store.permissions?.includes('Edit Group')">
                                    <client-only>
                                        <a href="javascript:;" v-tippy:edit>
                                            <icon-refresh class="text-success" />
                                        </a>
                                    </client-only>
                                </li>
                                <li v-else-if="isLoading.store.permissions?.includes('Edit Group')" @click="$router.push(`courses/${data.id}/edit`)">
                                    <client-only>
                                        <a href="javascript:;" v-tippy:edit>
                                            <icon-pencil class="text-success" />
                                        </a>
                                    </client-only>
                                </li>
                            </ul>
                            <li v-if="isLoading.store.permissions?.includes('Delete Course')" @click="handleDelete(data.id, 'course')">
                                <client-only>
                                    <a href="javascript:;" v-tippy:delete>
                                        <icon-trash-lines class="text-danger" />
                                    </a>
                                </client-only>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </div>
        <Pagination class="mt-4" />
    </div>

    <!-- delete -->
    <TransitionRoot appear :show="useCourses.modal.delete" as="template">
        <Dialog as="div" @close="useCourses.modal.delete = false" class="relative z-[51]">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button
                                type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="useCourses.modal.delete = false"
                            >
                                <icon-x />
                            </button>
                            <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                <p v-if="!useCourses.store.is_delete">
                                    <span class="capitalize">{{ store.delete_type }}</span
                                    >ni o'chirish
                                </p>
                                <p v-else>Kursni arxivdan o'chirish</p>
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                    <icon-trash-lines class="mx-auto h-7 w-7" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useCourses.modal.delete = false">Bekor qilish</button>
                                    <button v-if="!useCourses.store.is_delete" type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useCourses.deleteCourse">
                                        O'chirish
                                    </button>
                                    <button v-else type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useCourses.deleteArchiveCourse">
                                        Arxivdan o'chirish
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- reload from archive -->
    <TransitionRoot appear :show="useCourses.modal.remove_archive" as="template">
        <Dialog as="div" @close="useCourses.modal.remove_archive = false" class="relative z-[51]">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button
                                type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="useCourses.modal.remove_archive = false"
                            >
                                <icon-x />
                            </button>
                            <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Arxivdan chiqarish
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-[#027DFC1A] p-4 text-white">
                                    <img class="full_flex h-12 w-12 cursor-pointer rounded-md p-2" src="@/assets/svg/version.png" alt="" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham arxivdan chiqarmoqchimisiz?</div>
                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useCourses.modal.remove_archive = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useCourses.restoreCourse">
                                        Arxivdan chiqarish
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
    import Multiselect from '@suadelabs/vue3-multiselect';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    import 'vue3-quill/lib/vue3-quill.css';
    const router = useRouter();
    import { useCoursesStore, useLoadingStore, useModulesStore, useLessonStore, useAttachmentsStore, useAssignmentsStore } from '@/stores';
    useHead({ title: 'Kurslar' });
    const useCourses = useCoursesStore();
    const useLesson = useLessonStore();
    const isLoading = useLoadingStore();
    const useAttachment = useAttachmentsStore();
    const useAssignment = useAssignmentsStore();
    const useModules = useModulesStore();
    isLoading.store.page_name = 'courses';
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page | 1);

    // if(!isLoading.store.permissions?.includes('View Course')) {
    //     router.push("/");
    // }

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });
    const options = ref(['SPECIAL', 'REGULAR', 'ALIF']);
    const course_options = ref(['All Levels', 'Beginner', 'Intermediate', 'Expert']);

    const minutes_list = [];
    for (let i = 0; i <= 59; i++) {
        minutes_list.push(i < 10 ? '0' + i : i);
    }
    const hours_list = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const store = reactive({
        delete_type: 'course',
        is_delete: false,
    });

    function handleCourseName() {
        try {
            const nameParts = useCourses.create.name.split(' ');
            useCourses.create.suffix = nameParts.map((part) => part[0].toUpperCase()).join('');
        } catch (_) {
            useCourses.create.suffix = '';
        }
    }

    function handleAdd(type) {
        store.delete_type = type;
        useLesson.modal.create = true;
    }

    function handleTahrirlash(data, type) {
        store.delete_type = type;

        if (type == 'kurs') {
            useCourses.store.course_id = data.id;
            useModules.create.course_id = data.id;
            useCourses.getCourseData();

            for (let i in useCourses.create) {
                useCourses.create[i] = data[i];
            }

            useCourses.modal.create = true;
            useCourses.modal.edit = true;

            try {
                const duration = data.duration.split(':');
                useCourses.store.duration[0] = duration[0];
                useCourses.store.duration[1] = duration[1];
            } catch (_) {}
        } else {
            if (type == 'module') {
                useModules.store.module_id = data.id;
                useModules.create.course_id = useModules.create.course_id;
                for (let i in useModules.create) {
                    useModules.create[i] = data[i];
                }
                useModules.modal.create = true;
                useModules.modal.edit = true;
            }
            if (type == 'lesson') {
                useModules.store.lesson_id = data.id;
                // useModules.create.module_id = useModules.create.course_id;
                for (let i in useLesson.create) {
                    useLesson.create[i] = data[i];
                }
                useLesson.modal.edit = true;
            }
            useLesson.modal.create = true;
        }
    }

    function handleDelete(id, type) {
        store.delete_type = type;
        if (type == 'module') {
            useModules.store.module_id = id;
        }
        if (type == 'lesson') {
            useLesson.store.lesson_id = id;
        }
        if (type == 'fayl') {
            useAttachment.store.attachment_id = id;
        }
        if (type == 'topshiriq') {
            useAssignment.store.assignment_id = id;
        } else {
            useCourses.store.course_id = id;
        }
        useCourses.modal.delete = true;
    }

    function formateCreatedAt(date) {
        date = new Date(date); // Note: Months are zero-based, so 3 represents April
        const formattedDate = date
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
            .replace(/\//g, '.');
        return formattedDate;
    }

    function handleRemoveArchive(id) {
        useCourses.store.course_id = id;
        useCourses.modal.remove_archive = true;
    }

    onBeforeMount(() => {
        useCourses.getCourses();
    });

    watch(
        () => useCourses.store.is_delete,
        () => {
            if (useCourses.store.is_delete) {
                useCourses.getTrashCourses();
            } else {
                useCourses.getCourses();
            }
        }
    );

    watch(
        () => useCourses.modal.create,
        async () => {
            if (useCourses.modal.create) {
                const fileupload = await import('file-upload-with-preview');
                let FileUploadWithPreview = fileupload.default;
                // single image upload
                new FileUploadWithPreview('myFirstImage', {
                    images: {
                        baseImage: '/assets/images/file-preview.svg',
                        backgroundImage: '',
                    },
                });
            } else {
                useCourses.modal.edit = false;
                useCourses.clearData();
            }
        }
    );

    watch(
        () => useAttachment.create.lesson_id,
        () => {
            useAssignment.create.lesson_id = useAttachment.create.lesson_id;
        }
    );
</script>
