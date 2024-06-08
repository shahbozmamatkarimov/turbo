<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getPhrases')">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Iboralar</h5>
            <div class="flex items-center justify-center gap-4">
                <button
                    v-if="isLoading.store.permissions?.includes('Create Phrase')"
                    type="button"
                    class="btn btn-info h-10"
                    @click="usePhrases.modal.create = true"
                >
                    + Qo'shish
                </button>
                <button
                    v-if="isLoading.store.permissions?.includes('PhraseToJson Phrase')"
                    type="button"
                    class="btn btn-info h-10"
                    @click="usePhrases.modal.update_version = true"
                >
                    <img class="full_flex h-10 w-10 cursor-pointer rounded-md bg-[#027DFC1A] p-2" src="@/assets/svg/version.png" alt="" />Yangilash
                </button>
            </div>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>O'zbekcha</th>
                            <th>Koreyscha</th>
                            <th>Bo'lim</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in usePhrases.store.phrases" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td>{{ data.uzbek }}</td>
                                <td>{{ data.korean }}</td>
                                <td>{{ data.title }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit Phrase')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Phrase')" @click="handleDelete(data.id)">
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
            </div>
        </div>
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getPhrases') && !usePhrases.store.phrases.length">Ma'lumotlar yo'q</div>
        <Pagination />
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
                            <DialogPanel class="panel w-full max-w-lg rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="usePhrases.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Iborani <span v-if="usePhrases.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="usePhrases.createPhrase" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="usePhrases.create.uzbek" type="text" placeholder="Uzbek" class="form-input mb-4" required />
                                        <input v-model="usePhrases.create.korean" type="text" placeholder="Korean" class="form-input mb-4" required />
                                        <div class="mb-5">
                                            <client-only>
                                                <multiselect
                                                    v-model="usePhrases.create.phrase_category_id"
                                                    :options="usePhrases.store.categories"
                                                    class="custom-multiselect"
                                                    :searchable="true"
                                                    :preselect-first="true"
                                                    track-by="title"
                                                    label="title"
                                                    :allow-empty="true"
                                                    selected-label=""
                                                    select-label=""
                                                    deselect-label=""
                                                ></multiselect>
                                            </client-only>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="usePhrases.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" @click="usePhrases.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="usePhrases.modal.edit">Saqlash</p>
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

        <!-- update version -->
        <TransitionRoot appear :show="usePhrases.modal.update_version" as="template">
            <Dialog as="div" @close="usePhrases.modal.update_version = false" class="relative z-[51]">
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
                                    @click="usePhrases.modal.update_version = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Iboralarni yangilash
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-[#027DFC1A] p-4 text-white">
                                        <img class="full_flex h-12 w-12 cursor-pointer rounded-md p-2" src="@/assets/svg/version.png" alt="" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham iboralarni yangilamoqchimisiz?</div>
                                    <div class="mx-auto mt-5 text-danger sm:w-3/4">
                                        Eslatma: Agar yangilashni bossangiz, barchaning ilovasidagi iboralar ro'yhati yangilanib ketadi
                                    </div>
                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="usePhrases.modal.update_version = false">
                                            Bekor qilish
                                        </button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="usePhrases.updateVersion">Yangilash</button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
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
                                    Iborani o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu iborani o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="usePhrases.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="usePhrases.deletePhrase">O'chirish</button>
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
    useHead({ title: "Ro'yxat" });
    const usePhrases = usePhrasesStore();
    const router = useRouter();
    const isLoading = useLoadingStore();
    isLoading.store.pagination.current_page = +router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page);
    isLoading.store.page_name = 'phrases';

    if(!isLoading.store.permissions?.includes('View Phrase')) {
        router.push("/");
    }

    function handleTahrirlash(data) {
        usePhrases.store.phrases_id = data.id;
        for (let i in usePhrases.create) {
            usePhrases.create[i] = data[i];
        }
        for (let i of usePhrases.store.categories) {
            if (i.id == usePhrases.create.phrase_category_id) {
                usePhrases.create.phrase_category_id = i;
            }
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
            if (!usePhrases.modal.create) {
                usePhrases.modal.edit = false;
                usePhrases.clearData();
            }
        }
    );

    onBeforeMount(() => {
        usePhrases.getCategories('no_page');
        usePhrases.getPhrases();
    });
</script>
