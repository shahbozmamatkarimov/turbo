<template>
    <div v-loading="isLoading.isLoadingType('getCategories')" class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Bo'limlar</h5>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <div v-if="isLoading.store.permissions?.includes('Create Phrase Category')" 
               @click="usePhrases.modal.create = true"
                class="grid h-full w-full max-w-[22rem] cursor-pointer place-content-center rounded-md border border-white-dark/20 dark:border-[#191e3a]"
            >
                <icon-plus class="h-6 w-6" />
            </div>
            <template v-for="data in usePhrases.store.categories" :key="data.id">
                <div class="relative flex max-w-[22rem] items-center justify-center">
                    <div
                        class="w-full max-w-[22rem] rounded border border-[#e0e6ed] bg-white pb-2 shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none"
                    >
                        <div class="px-6 py-7">
                            <div class="-mx-6 -mt-7 mb-2 h-[200px] overflow-hidden rounded-tl rounded-tr">
                                <img :src="data.image" alt="" class="h-full w-full object-cover" />
                            </div>
                            <div
                                class="relative flex justify-between pt-4 before:absolute before:inset-x-0 before:top-0 before:mx-auto before:h-[1px] before:w-[250px] before:bg-[#e0e6ed] dark:before:bg-[#1b2e4b]"
                            >
                                <div class="flex items-center font-semibold">
                                    <div class="inline-block h-9 w-9 shrink-0 overflow-hidden rounded-full ltr:mr-2 rtl:ml-2.5">
                                        <span class="flex h-full w-full items-center justify-center text-[#e0e6ed]" :style="`background: ${data.color}`"></span>
                                    </div>
                                    <div class="text-[#515365] dark:text-white-dark">{{ data.title }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="absolute bottom-3 right-4 flex items-center justify-center gap-3 py-2">
                        <li v-if="isLoading.store.permissions?.includes('Edit Phrase Category')" @click="handleTahrirlash(data)">
                            <client-only>
                                <a href="javascript:;" v-tippy:edit>
                                    <icon-pencil class="text-success" />
                                </a>
                            </client-only>
                        </li>
                        <li v-if="isLoading.store.permissions?.includes('Delete Phrase Category')" @click="handleDelete(data.id)">
                            <client-only>
                                <a href="javascript:;" v-tippy:delete>
                                    <icon-trash-lines class="text-danger" />
                                </a>
                            </client-only>
                        </li>
                    </ul>
                </div>
            </template>
        </div>
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getCategories') && !usePhrases.store.categories.length">
            Ma'lumotlar yo'q
        </div>

        <Pagination class="mt-4" />
    </div>

    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="usePhrases.modal.create" as="template">
            <Dialog as="div" @close="usePhrases.modal.create = false" class="relative z-[51]">
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

                <form @submit.prevent="usePhrases.createCategory" class="fixed inset-0 overflow-y-auto">
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
                                    @click="usePhrases.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Kategoriyani <span v-if="usePhrases.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <div class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="usePhrases.create_category.title" type="text" placeholder="Sarlavha" class="form-input mb-4" required />
                                        <input
                                            v-model="usePhrases.create_category.color"
                                            type="color"
                                            placeholder="Rangi"
                                            class="form-input mb-4 !p-0"
                                            required
                                        />
                                        <div class="label-container">
                                            <label>Yuklash </label>
                                            <a href="javascript:;" class="custom-file-container__image-clear" title="Clear Image">×</a>
                                        </div>
                                        <label class="custom-file-container__custom-file">
                                            <input
                                                id="fileupload"
                                                @change="handleFileUpload"
                                                type="file"
                                                class="custom-file-container__custom-file__custom-file-input"
                                                accept="image/*"
                                            />
                                            <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                                            <span class="custom-file-container__custom-file__custom-file-control ltr:pr-20 rtl:pl-20"></span>
                                        </label>
                                        <label for="fileupload" class="custom-file-container__image-preview"></label>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="usePhrases.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="Submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="usePhrases.modal.edit">Saqlash</p>
                                            <p v-else>Qo'shish</p>
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </form>
            </Dialog>
        </TransitionRoot>

        <TransitionRoot appear :show="usePhrases.modal.delete" as="template">
            <Dialog as="div" @close="usePhrases.modal.delete = false" class="relative z-[51]">
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
                                    @click="usePhrases.modal.delete = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Kategoriyani o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu kategoriyani o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="usePhrases.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="usePhrases.deleteCategory">O'chirish</button>
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
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
    import Multiselect from '@suadelabs/vue3-multiselect';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    import { usePhrasesStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Ibora' });
    const usePhrases = usePhrasesStore();
    const isLoading = useLoadingStore();
    const router = useRouter();
    isLoading.store.page_name = 'phrase_category';
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page);

    if(!isLoading.store.permissions?.includes('View Phrase Category')) {
        router.push("/");
    }

    function handleFileUpload(e) {
        usePhrases.create_category.photo = e.target.files[0];
    }

    function handleTahrirlash(data) {
        usePhrases.store.phrases_id = data.id;
        for (let i in usePhrases.create_category) {
            usePhrases.create_category[i] = data[i];
        }
        usePhrases.modal.create = true;
        usePhrases.modal.edit = true;
    }

    function handleDelete(id) {
        usePhrases.store.phrases_id = id;
        usePhrases.modal.delete = true;
    }

    watch(
        () => usePhrases.modal.create,
        async () => {
            if (usePhrases.modal.create) {
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
                usePhrases.modal.edit = false;
                usePhrases.clearData();
            }
        }
    );

    onBeforeMount(() => {
        usePhrases.getCategories();
    });
</script>
