<template>
    <div v-loading="isLoading.isLoadingType('getAttachments')" class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 @click="$router.back()" class="flex items-center cursor-pointer gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                Fayl
            </h5>
            <!-- <div v-if="isLoading.store.permissions?.includes('Create Attachment')" class="flex items-center justify-center">
                <button type="button" class="btn btn-info" @click="useAttachments.modal.create = true">+ Qo'shish</button>
            </div> -->
            <div class="flex items-center justify-center">
                <button type="button" class="btn btn-info" @click="useAttachments.modal.create = true">+ Qo'shish</button>
            </div>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nomi</th>
                            <th>Tavsifi</th>
                            <th>Max ball</th>
                            <th>Dars</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in useAttachments.store.attachments" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td>{{ data.name }}</td>
                                <td>{{ data.lesson?.title }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit Attachment')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Attachment')" @click="handleDelete(data.id)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:delete>
                                                    <icon-trash-lines class="text-danger" />
                                                </a>
                                            </client-only>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getAttachments') && !useAttachments.store.attachments.length">
                    Ma'lumotlar yo'q
                </div>
            </div>
        </div>
        <Pagination />
    </div>
    
    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="useAttachments.modal.create" as="template">
            <Dialog as="div" @close="useAttachments.modal.create = false" class="relative z-[51]">
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
                                    @click="useAttachments.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Kursni <span v-if="useAttachments.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useAttachments.createAttachment" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <h1>Fayl</h1>
                                        <input
                                            @change="handleAttachment"
                                            type="file"
                                            class="form-input mb-4"
                                            required
                                        />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useAttachments.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useAttachments.modal.edit">Saqlash</p>
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

    <TransitionRoot appear :show="useAttachments.modal.delete" as="template">
        <Dialog as="div" @close="useAttachments.modal.delete = false" class="relative z-[51]">
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
                                @click="useAttachments.modal.delete = false"
                            >
                                <icon-x />
                            </button>
                            <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Kursni o'chirish
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                    <icon-trash-lines class="mx-auto h-7 w-7" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu faylni o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useAttachments.modal.delete = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useAttachments.deleteAttachment">O'chirish</button>
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
    import 'vue3-quill/lib/vue3-quill.css';
    const router = useRouter();
    import { useAttachmentsStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Kurslar' });
    const useAttachments = useAttachmentsStore();
    const isLoading = useLoadingStore();
    isLoading.store.page_name = 'attachments';
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page | 1);

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });
    const options = ref(['SPECIAL', 'REGULAR', 'ALIF']);

    function handleAttachment(e) {
        useAttachments.create.file = e.target.files[0];
    }

    function handleTahrirlash(data) {
        useAttachments.store.attachment_id = data.id;
        for (let i in useAttachments.create) {
            useAttachments.create[i] = data[i];
        }
        useAttachments.modal.create = true;
        useAttachments.modal.edit = true;
    }

    function handleDelete(id) {
        useAttachments.store.attachment_id = id;
        useAttachments.modal.delete = true;
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
        useAttachments.create.image = e.target.files[0];
    }

    onBeforeMount(() => {
        useAttachments.getAttachments();
    });

    watch(
        () => useAttachments.modal.create,
        async () => {
            if (!useAttachments.modal.create) {
                useAttachments.modal.edit = false;
                useAttachments.clearData();
            }
        }
    );
</script>
