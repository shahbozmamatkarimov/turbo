<template>
    <div v-loading="isLoading.isLoadingType('getGroupAssignments')" class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 @click="$router.back()" class="flex items-center cursor-pointer gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                Topshiriqlar
            </h5>
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
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in useGroup.store.group_assignments" :key="data.id">
                            <tr>
                                <td @click="routeToCheckAssign(data.id)" class="cursor-pointer whitespace-nowrap">#{{ data.id }}</td>
                                <td @click="routeToCheckAssign(data.id)" class="cursor-pointer">{{ data.name }}</td>
                                <td @click="routeToCheckAssign(data.id)" class="cursor-pointer" v-html="data.description"></td>
                                <td @click="routeToCheckAssign(data.id)" class="cursor-pointer">{{ data.max_score }}</td>
                                <td @click="routeToCheckAssign(data.id)" class="cursor-pointer">{{ data.lesson?.title }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getGroupAssignments') && !useGroup.store.group_assignments.length">
                    Ma'lumotlar yo'q
                </div>
            </div>
        </div>
        <Pagination />
    </div>
    
    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="useGroup.modal.create" as="template">
            <Dialog as="div" @close="useGroup.modal.create = false" class="relative z-[51]">
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
                                    @click="useGroup.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Kursni <span v-if="useGroup.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useGroup.createAssignment" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <h1>Topshiriq nomi</h1>
                                        <input
                                            @input="handleAssignmentName"
                                            v-model="useGroup.create.name"
                                            type="text"
                                            placeholder="Nomi"
                                            class="form-input mb-4"
                                            required
                                        />
                                        <h1>Max ball</h1>
                                        <input
                                            @input="handleAssignmentName"
                                            v-model="useGroup.create.max_score"
                                            type="number"
                                            placeholder="Nomi"
                                            class="form-input mb-4"
                                            required
                                        />
                                        <div class="mb-5">
                                            <h1>Tavsifi</h1>
                                            <client-only>
                                                <quillEditor
                                                    ref="editor"
                                                    v-model:value="useGroup.create.description"
                                                    :options="options1"
                                                    style="min-height: 100px"
                                                ></quillEditor>
                                            </client-only>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useGroup.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useGroup.modal.edit">Saqlash</p>
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

    <TransitionRoot appear :show="useGroup.modal.delete" as="template">
        <Dialog as="div" @close="useGroup.modal.delete = false" class="relative z-[51]">
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
                                @click="useGroup.modal.delete = false"
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
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu topshiriqni o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useGroup.modal.delete = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useGroup.deleteAssignment">O'chirish</button>
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
    import { useGroupStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Kurslar' });
    const useGroup = useGroupStore();
    const isLoading = useLoadingStore();
    isLoading.store.page_name = 'group_assignments';
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page | 1);

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });
    const options = ref(['SPECIAL', 'REGULAR', 'ALIF']);

    function routeToCheckAssign(id) {
        const group_id = router.currentRoute.value.params.group_id;
        router.push(`/group/assignments/${group_id}/check-assignment/${id}`);
    }

    function handleAssignmentName() {
        try {
            const nameParts = useGroup.create.name.split(' ');
            useGroup.create.suffix = nameParts.map((part) => part[0].toUpperCase()).join('');
        } catch (_) {
            useGroup.create.suffix = '';
        }
    }

    function handleTahrirlash(data) {
        useGroup.store.assignment_id = data.id;
        for (let i in useGroup.create) {
            useGroup.create[i] = data[i];
        }
        useGroup.modal.create = true;
        useGroup.modal.edit = true;
    }

    function handleDelete(id) {
        useGroup.store.assignment_id = id;
        useGroup.modal.delete = true;
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
        useGroup.create.image = e.target.files[0];
    }

    onBeforeMount(() => {
        useGroup.getGroupAssignments();
    });

    watch(
        () => useGroup.modal.create,
        async () => {
            if (!useGroup.modal.create) {
                useGroup.modal.edit = false;
                useGroup.clearData();
            }
        }
    );
</script>
