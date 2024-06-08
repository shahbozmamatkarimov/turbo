<template>
    <div v-loading="isLoading.isLoadingType('getChecklist')" class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">PDF fayllar</h5>
            <div class="flex items-center justify-center">
                <button
                    v-if="isLoading.store.permissions?.includes('Create Checklist')"
                    type="button"
                    class="btn btn-info"
                    @click="useCheckList.modal.create = true"
                >
                    + Qo'shish
                </button>
            </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <template v-for="data in useCheckList.store.checkList" :key="data.id">
                <div class="flex cursor-pointer items-center justify-center">
                    <div
                        class="relative w-full max-w-[22rem] rounded border border-[#e0e6ed] bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none"
                    >
                        <div class="px-6 py-7 pb-[60px]">
                            <div class="-mx-6 -mt-7 mb-2 h-[200px] overflow-hidden rounded-tl rounded-tr">
                                <img :src="data.image" alt="" class="h-full w-full object-cover" />
                            </div>
                            <p class="mb-1 text-xs font-bold text-primary">{{ formateCreatedAt(data.created_at) }}</p>
                            <h5 class="mb-2 line-clamp-2 text-[15px] font-bold text-[#3b3f5c] dark:text-white-light">{{ data.name }}</h5>
                            <p class="mb-2 text-[16px] font-medium text-dark">{{ data.title }}</p>
                            <p class="line-clamp-3 text-sm text-white-dark" v-html="data.description"></p>
                            <div
                                class="relative mt-4 flex justify-between pt-4 before:absolute before:inset-x-0 before:top-0 before:mx-auto before:h-[1px] before:w-[250px] before:bg-[#e0e6ed] dark:before:bg-[#1b2e4b]"
                            ></div>
                            <ul class="mb-2 dark:text-gray-200">
                                <li class="flex justify-between">
                                    Status:
                                    <p>{{ data.status }}</p>
                                </li>
                                <li class="mt-4 flex justify-between">
                                    <div class="flex gap-2">
                                        <icon-file class="h-4.5 w-4.5" />
                                        File:
                                    </div>
                                    <a download :href="data.file_url" class="hover:unerline text-primary">Yuklash</a>
                                    <a :href="data.file_url" target="_blank" class="hover:unerline flex text-primary"
                                        >Ochish
                                        <icon-open-book class="h-4.5 w-4.5" />
                                    </a>
                                </li>
                            </ul>
                            <div
                                class="relative mt-4 flex justify-between pt-4 before:absolute before:inset-x-0 before:top-0 before:mx-auto before:h-[1px] before:w-[250px] before:bg-[#e0e6ed] dark:before:bg-[#1b2e4b]"
                            ></div>
                        </div>
                        <ul class="absolute bottom-3 right-4 flex items-center justify-center gap-3 py-2">
                            <li v-if="isLoading.store.permissions?.includes('Edit Checklist')" @click="handleTahrirlash(data)">
                                <client-only>
                                    <a href="javascript:;" v-tippy:edit>
                                        <icon-pencil class="text-success" />
                                    </a>
                                </client-only>
                            </li>
                            <li v-if="isLoading.store.permissions?.includes('Delete Checklist')" @click="handleDelete(data.id)">
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
        <!-- <Pagination class="mt-4" /> -->
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create -->
        <TransitionRoot appear :show="useCheckList.modal.create" as="template">
            <Dialog as="div" @close="useCheckList.modal.create = false" class="relative z-[51]">
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
                                    @click="useCheckList.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Faylni <span v-if="useCheckList.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useCheckList.createCheckList" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useCheckList.create.title" type="text" placeholder="Nomi" class="form-input mb-4" required />
                                        <div class="mb-5">
                                            <h1>Tavsifi</h1>
                                            <client-only>
                                                <quillEditor
                                                    ref="editor"
                                                    v-model:value="useCheckList.create.description"
                                                    :options="options1"
                                                    style="min-height: 100px"
                                                ></quillEditor>
                                            </client-only>
                                        </div>
                                        <div class="mb-5">
                                            <client-only>
                                                <multiselect
                                                    v-model="useCheckList.create.status"
                                                    :options="options"
                                                    class="custom-multiselect"
                                                    :searchable="false"
                                                    :preselect-first="true"
                                                    :allow-empty="false"
                                                    selected-label=""
                                                    select-label=""
                                                    deselect-label=""
                                                ></multiselect>
                                            </client-only>
                                        </div>
                                        <div>
                                            <div class="flex items-center justify-between">
                                                <label>Fayl yuklash </label>
                                            </div>
                                            <label class="mb-6">
                                                <input @change="handleFileUpload2" type="file" accept=".pdf" />
                                            </label>
                                        </div>
                                        <div>
                                            <div class="flex items-center justify-between">
                                                <label>Rasm yuklash </label>
                                            </div>
                                            <label class="mb-6">
                                                <input @change="handleFileUpload" type="file" accept="image/*" />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useCheckList.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button v-loading="isLoading.isLoadingType('updateChecklist')" type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useCheckList.modal.edit">Saqlash</p>
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

        <!-- delete -->
        <TransitionRoot v-loading="isLoading.isLoadingType('deleteCheckList')" appear :show="useCheckList.modal.delete" as="template">
            <Dialog as="div" @close="useCheckList.modal.delete = false" class="relative z-[51]">
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
                                    @click="useCheckList.modal.delete = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Faylni o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="useCheckList.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useCheckList.deleteCheckList">O'chirish</button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </client-only>
</template>
<script setup>
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
    import Multiselect from '@suadelabs/vue3-multiselect';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    import 'vue3-quill/lib/vue3-quill.css';
    const router = useRouter();
    import { useCheckListStore, useLoadingStore } from '@/stores';
    useHead({ title: 'PDF fayllar' });
    const useCheckList = useCheckListStore();
    const isLoading = useLoadingStore();
    isLoading.store.page_name = 'checklist';
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', isLoading.store.pagination.current_page);

    if (!isLoading.store.permissions?.includes('View Checklist')) {
        router.push('/');
    }

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });
    const options = ref(['new', 'standart', 'archived']);

    function handleTahrirlash(data) {
        useCheckList.store.id = data.id;
        for (let i in useCheckList.create) {
            useCheckList.create[i] = data[i];
        }
        useCheckList.modal.create = true;
        useCheckList.modal.edit = true;
    }

    function handleDelete(id) {
        useCheckList.store.id = id;
        useCheckList.modal.delete = true;
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
        useCheckList.create.photo = e.target.files[0];
    }

    function handleFileUpload2(e) {
        useCheckList.create.document = e.target.files[0];
    }

    onBeforeMount(() => {
        useCheckList.getChecklist();
    });

    watch(
        () => useCheckList.modal.create,
        async () => {
            if (useCheckList.modal.create) {
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
                useCheckList.modal.edit = false;
                useCheckList.clearData();
            }
        }
    );

    // watch(
    //     () => router.currentRoute.value.query.page,
    //     () => {
    //         useCheckList.getChecklist();
    //     }
    // );
</script>
