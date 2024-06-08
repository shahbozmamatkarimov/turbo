<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getModules')">
        <div class="mb-5 flex items-center justify-between">
            <h5 @click="$router.back()" class="flex items-center cursor-pointer gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                Modullar
            </h5>
            <div class="flex items-center justify-center">
                <button v-if="isLoading.store.permissions?.includes('Create Module')" type="button" class="btn btn-info" @click="useModules.modal.create = true">+ Qo'shish</button>
            </div>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table class="w-full">
                    <tbody class="!w-full" v-loading="isLoading.isLoadingType('updatePosition')">
                        <draggable
                            @change="useModules.updatePosition"
                            :list="useModules.store.modules"
                            group="grid"
                            :animation="200"
                            class="grid !min-w-full grid-cols-1"
                        >
                            <!-- <template  class="!w-full" :key="data.id"> -->
                                <tr v-for="(data, index) in useModules.store.modules" class="!min-w-full cursor-pointer">
                                    <td @click="nextLesson(data.id)" class="whitespace-nowrap">{{ index + 1 }}</td>
                                    <td @click="nextLesson(data.id)">{{ data.name }}</td>
                                    <td class="text-center">
                                        <ul class="flex items-center justify-center gap-3">
                                            <li v-if="isLoading.store.permissions?.includes('Edit Module')" @click="handleTahrirlash(data)">
                                                <client-only>
                                                    <a href="javascript:;" v-tippy:edit>
                                                        <icon-pencil class="text-success" />
                                                    </a>
                                                </client-only>
                                            </li>
                                            <li v-if="isLoading.store.permissions?.includes('Delete Module')" @click="handleDelete(data.id)">
                                                <client-only>
                                                    <a href="javascript:;" v-tippy:delete>
                                                        <icon-trash-lines class="text-danger" />
                                                    </a>
                                                </client-only>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            <!-- </template> -->
                        </draggable>
                    </tbody>
                </table>
                <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getModules') && !useModules.store.modules.length">
                    Ma'lumotlar yo'q
                </div>
            </div>
        </div>
        <!-- <Pagination /> -->
    </div>

    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="useModules.modal.create" as="template">
            <Dialog as="div" @close="useModules.modal.create = false" class="relative z-[51]">
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
                                    @click="useModules.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Modul <span v-if="useModules.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useModules.createModule" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useModules.create.name" type="text" placeholder="Nomi" class="form-input mb-4" required />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useModules.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useModules.modal.edit">Saqlash</p>
                                            <p v-else>Qo'shish</p>
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </client-only>

    <TransitionRoot appear :show="useModules.modal.delete" as="template">
        <Dialog as="div" @close="useModules.modal.delete = false" class="relative z-[51]">
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
                                @click="useModules.modal.delete = false"
                            >
                                <icon-x />
                            </button>
                            <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Modulni o'chirish
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                    <icon-trash-lines class="mx-auto h-7 w-7" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu modulni o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useModules.modal.delete = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useModules.deleteModule">O'chirish</button>
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
    import { VueDraggableNext as draggable } from 'vue-draggable-next';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    import 'vue3-quill/lib/vue3-quill.css';
    const router = useRouter();
    import { useModulesStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Modullar' });

    
    const useModules = useModulesStore();
    const isLoading = useLoadingStore();
    
    // if(!isLoading.store.permissions?.includes('View Module')) {
    //     router.push("/");
    // }
    isLoading.store.page_name = 'modules';

    function handleTahrirlash(data) {
        useModules.store.module_id = data.id;
        for (let i in useModules.create) {
            useModules.create[i] = data[i];
        }
        useModules.modal.create = true;
        useModules.modal.edit = true;
    }

    function handleDelete(id) {
        useModules.store.module_id = id;
        useModules.modal.delete = true;
    }

    function nextLesson(id) {
        const course_id = router.currentRoute.value.params.id;
        router.push(`/courses/${course_id}/module/${id}/lesson`);
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

    function handleFileUpload(e) {
        useModules.create.image = e.target.files[0];
    }

    onBeforeMount(() => {
        useModules.getModules();
    });

    watch(
        () => useModules.modal.create,
        async () => {
            if (useModules.modal.create) {
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
                useModules.modal.edit = false;
                useModules.clearData();
            }
        }
    );
</script>
