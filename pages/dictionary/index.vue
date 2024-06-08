<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getWords')">
        <div class="mb-5 flex items-start justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Lug'at</h5>
            <ClientOnly>
                <div class="full_flex gap-4">
                    <div class="full_flex rounded-md bg-[#027DFC1A] duration-1000">
                        <button @click="store.table = false" :class="store.table ? '' : 'bg-[#027DFC]'" class="full_flex h-12 w-12 rounded-md duration-700">
                            <img class="mx-auto w-6 rotate-90" v-show="store.table" src="@/assets/svg/table.svg" alt="" />
                            <img class="mx-auto w-6 rotate-90" v-show="!store.table" src="@/assets/svg/table_white.svg" alt="" />
                        </button>
                        <button @click="store.table = true" :class="!store.table ? '' : 'bg-[#027DFC]'" class="full_flex h-12 w-12 rounded-md duration-700">
                            <img class="mx-auto w-6" v-show="!store.table" src="@/assets/svg/grid.svg" alt="" />
                            <img class="mx-auto w-6" v-show="store.table" src="@/assets/svg/grid_white.svg" alt="" />
                        </button>
                    </div>
                    <button
                        v-if="isLoading.store.permissions?.includes('WordToJson Word')"
                        type="button"
                        class="btn btn-info h-12"
                        @click="useWord.modal.update_version = true"
                    >
                        <img class="full_flex h-10 w-10 cursor-pointer rounded-md bg-[#027DFC1A] p-2" src="@/assets/svg/version.png" alt="" />Yangilash
                    </button>
                </div>
            </ClientOnly>
        </div>
        <div
            v-if="isLoading.store.permissions?.includes('Create Word')"
            @click="useWord.modal.create = true"
            class="mb-4 grid w-full cursor-pointer place-content-center rounded-md border border-white-dark/20 dark:border-[#191e3a]"
            :class="store.table ? 'h-40' : 'h-10'"
        >
            <icon-plus class="h-6 w-6" />
        </div>
        <div v-loading="isLoading.isLoadingType('updatePosition')">
            <draggable
                v-if="store.table"
                @change="useWord.updatePosition"
                :list="useWord.store.words"
                group="grid"
                :animation="200"
                class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            >
                <template v-for="(data, index) in useWord.store.words" :key="data.id">
                    <div
                        class="relative w-full rounded border border-[#e0e6ed] bg-white pb-[40px] shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none"
                    >
                        <div class="mx-auto max-w-[900px] space-y-2 p-2.5">
                            <div class="self-center ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                <p class="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{{ data.uzbek }}</p>
                                <p class="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">O'zbekcha</p>
                            </div>
                            <div class="self-center ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                <p class="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{{ data.korean }} [{{ data.transcript }}]</p>
                                <p class="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">Korescha</p>
                            </div>
                            <div class="self-center ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                <p class="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light" v-html="data.description"></p>
                                <p class="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">Tavsifi</p>
                            </div>
                        </div>
                        <ul class="absolute bottom-3 right-4 flex items-center justify-center gap-3 py-2">
                            <li v-if="isLoading.store.permissions?.includes('Edit Word')" @click="handleTahrirlash(data)">
                                <client-only>
                                    <a href="javascript:;" v-tippy:edit>
                                        <icon-pencil class="text-success" />
                                    </a>
                                </client-only>
                            </li>
                            <li v-if="isLoading.store.permissions?.includes('Delete Word')" @click="handleDelete(data.id)">
                                <client-only>
                                    <a href="javascript:;" v-tippy:delete>
                                        <icon-trash-lines class="text-danger" />
                                    </a>
                                </client-only>
                            </li>
                        </ul>
                    </div>
                </template>
            </draggable>
            <div v-else class="panel" v-loading="isLoading.isLoadingType('getPhrases')">
                <div class="mb-5">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>O'zbekcha</th>
                                    <th>Korescha</th>
                                    <th>Transkript</th>
                                    <th>Tavsifi</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="data in useWord.store.words" :key="data.id">
                                    <tr>
                                        <td>{{ data.uzbek }}</td>
                                        <td>{{ data.korean }}</td>
                                        <td>{{ data.transcript }}</td>
                                        <td v-html="data.description"></td>
                                        <td class="text-center">
                                            <ul class="flex items-center justify-center gap-3">
                                                <li v-if="isLoading.store.permissions?.includes('Edit Word')" @click="handleTahrirlash(data)">
                                                    <client-only>
                                                        <a href="javascript:;" v-tippy:edit>
                                                            <icon-pencil class="text-success" />
                                                        </a>
                                                    </client-only>
                                                </li>
                                                <li v-if="isLoading.store.permissions?.includes('Delete Word')" @click="handleDelete(data.id)">
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
            </div>
        </div>
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getWords') && !useWord.store.words.length">Ma'lumotlar yo'q</div>
        <Pagination class="mt-4" />
    </div>

    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="useWord.modal.create" as="template">
            <Dialog as="div" @close="useWord.modal.create = false" class="relative z-[51]">
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
                    <form @submit.prevent="useWord.createWord" class="flex min-h-full items-center justify-center px-4 py-8">
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
                                    @click="useWord.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Lug'at <span v-if="useWord.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <div class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useWord.create.uzbek" type="text" placeholder="O'zbekcha" class="form-input mb-4" required />
                                        <input v-model="useWord.create.korean" type="text" placeholder="Korescha" class="form-input mb-4" required />
                                        <input v-model="useWord.create.transcript" type="text" placeholder="Transkript" class="form-input mb-4" />
                                        <div class="mb-5">
                                            <h1>Tavsifi</h1>
                                            <client-only>
                                                <quillEditor
                                                    ref="editor"
                                                    v-model:value="useWord.create.description"
                                                    :options="options1"
                                                    style="min-height: 100px"
                                                ></quillEditor>
                                            </client-only>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useWord.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="Submit" @click="useWord.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useWord.modal.edit">Saqlash</p>
                                            <p v-else>Qo'shish</p>
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </form>
                </div>
            </Dialog>
        </TransitionRoot>

        <TransitionRoot appear :show="useWord.modal.update_version" as="template">
            <Dialog as="div" @close="useWord.modal.update_version = false" class="relative z-[51]">
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
                                    @click="useWord.modal.update_version = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Lug'atni yangilash
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-[#027DFC1A] p-4 text-white">
                                        <img class="full_flex h-12 w-12 cursor-pointer rounded-md p-2" src="@/assets/svg/version.png" alt="" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham lug'atni yangilamoqchimisiz?</div>
                                    <div class="mx-auto mt-5 text-danger sm:w-3/4">
                                        Eslatma: Agar yangilashni bossangiz, barchaning ilovasidagi lug'atlar yangilanib ketadi
                                    </div>
                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="useWord.modal.update_version = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useWord.updateVersion">Yangilash</button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </client-only>

    <!-- delete -->
    <TransitionRoot appear :show="useWord.modal.delete" as="template">
        <Dialog as="div" @close="useWord.modal.delete = false" class="relative z-[51]">
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
                                @click="useWord.modal.delete = false"
                            >
                                <icon-x />
                            </button>
                            <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Lug'atni o'chirish
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                    <icon-trash-lines class="mx-auto h-7 w-7" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham lug'atni o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useWord.modal.delete = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useWord.deleteWord">O'chirish</button>
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
    import { VueDraggableNext as draggable } from 'vue-draggable-next';
    import { onMounted } from 'vue';
    import 'vue3-quill/lib/vue3-quill.css';
    import { useWordStore, useLoadingStore } from '@/stores';
    useHead({ title: "Lug'at" });
    const useWord = useWordStore();
    const isLoading = useLoadingStore();
    const list = ref([]);
    const router = useRouter();
    isLoading.store.page_name = 'words';
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page);
    const store = reactive({
        table: false,
    });

    if (!isLoading.store.permissions?.includes('View Word')) {
        router.push('/');
    }

    function handleTahrirlash(data) {
        useWord.store.word_id = data.id;
        for (let i in useWord.create) {
            useWord.create[i] = data[i];
        }
        useWord.modal.create = true;
        useWord.modal.edit = true;
    }

    function handleDelete(id) {
        useWord.store.word_id = id;
        useWord.modal.delete = true;
    }

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });

    onBeforeMount(() => {
        useWord.getWords();
    });

    onMounted(() => {
        store.table = localStorage.getItem('table_type') == 'true' ? true : false;
    });

    watch(
        () => useWord.modal.create,
        () => {
            if (!useWord.modal.create) {
                useWord.modal.edit = false;
                useWord.clearData();
            }
        }
    );

    watch(
        () => store.table,
        () => {
            localStorage.setItem('table_type', store.table);
        }
    );
</script>
