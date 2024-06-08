<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getLessons')">
        <div class="mb-5 flex items-center justify-between">
            <h5 @click="$router.back()" class="flex items-center cursor-pointer gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                Darslar
            </h5>
            <div class="flex items-center justify-center">
                <button v-if="isLoading.store.permissions?.includes('Create Lesson')" type="button" class="btn btn-info" @click="useLesson.modal.create = true">
                    + Qo'shish
                </button>
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
                            <th>Video link</th>
                            <th>Dars davomiyligi</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in useLesson.store.lessons" :key="data.id">
                            <tr>
                                <td @click="handleTahrirlash(data)" class="cursor-pointer whitespace-nowrap">#{{ data.id }}</td>
                                <td @click="handleTahrirlash(data)" class="cursor-pointer">{{ data.title }}</td>
                                <td @click="handleTahrirlash(data)" class="cursor-pointer" v-html="data.description"></td>
                                <td @click="handleTahrirlash(data)" class="cursor-pointer">{{ data.video }}</td>
                                <td @click="handleTahrirlash(data)" class="cursor-pointer">{{ data.duration }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit Lesson')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Lesson')" @click="handleDelete(data.id)">
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
                <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getLessons') && !useLesson.store.lessons.length">
                    Ma'lumotlar yo'q
                </div>
            </div>
        </div>
        <!-- <Pagination /> -->
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create lesson-->
        <TransitionRoot appear :show="useLesson.modal.create" as="template">
            <Dialog as="div" @close="useLesson.modal.create = false" class="relative z-[51]">
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
                            <DialogPanel
                            v-if="!useAssignments.modal.create"
                                v-loading="isLoading.isLoadingType('getLessonById')"
                                class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                            >
                                <button
                                    type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useLesson.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Dars <span v-if="useLesson.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useLesson.createLesson" class="p-5">
                                    <div data-upload-id="myFirstImage">
                                        <h1>Dars nomi</h1>
                                        <input v-model="useLesson.create.title" type="text" placeholder="Nomi" class="form-input mb-4" required />
                                    </div>
                                    <div>
                                        <h1>Tavsifi</h1>
                                        <quillEditor
                                            ref="editor"
                                            v-model:value="useLesson.create.description"
                                            :options="options1"
                                            style="min-height: 100px"
                                        ></quillEditor>
                                    </div>
                                    <div class="mt-4">
                                        <h1>Video link</h1>
                                        <input v-model="useLesson.create.video" type="url" placeholder="link" class="form-input mb-4" />
                                    </div>
                                    <div>
                                        <h1>Dars davomiyligi</h1>
                                        <input
                                            v-model="useLesson.create.duration"
                                            type="text"
                                            placeholder="Dars davomiyligi"
                                            class="form-input mb-4"
                                        />
                                    </div>
                                    <hr class="mb-3 mt-5 border border-red-600" />
                                    <div class="demo-collapse">
    <el-collapse accordion>
        <el-collapse-item title="Filelar" name="1">
            <ul v-for="(data, index) in useLesson.store.lesson_data.attachments" class="mb-3">
                                            <!-- <input @change="(e) => handleAttachment(e, index)" type="file" class="form-input mb-4" /> -->
                                            <li class="mt-4 flex justify-between">
                                                <div class="flex gap-2">
                                                    <icon-file class="h-4.5 w-4.5 min-w-[18px]" />
                                                    <p>File</p>
                                                </div>
                                                <a download target="_blank" :href="data.file_url" class="hover:unerdine text-primary">Yuklash</a>
                                                <a :href="data.file_url" target="_blank" class="hover:unerline flex text-primary"
                                                    >Ochish
                                                    <icon-open-book class="h-4.5 w-4.5" />
                                                </a>
                                                <li v-if="isLoading.store.permissions?.includes('Delete Lesson')" @click="handleDeleteAttach(data.id)">
                                                    <client-only>
                                                        <a href="javascript:;" v-tippy:delete>
                                                            <icon-trash-lines class="text-danger" />
                                                        </a>
                                                    </client-only>
                                                </li>
                                            </li>
                                        </ul>
                                        <div class="mb-4 flex items-center gap-3" v-for="(i, index) in useLesson.store.attachment_step">
                                            <input @change="(e) => handleAttachment(e, index)" type="file" class="form-input" />
                                            <icon-minus-circle @click="() => removeFile(index)" class="cursor-pointer" />
                                        </div>
                                        <button
                                            @click="useLesson.store.attachment_step += 1"
                                            type="button"
                                            class="w-full rounded-md border border-primary py-1"
                                        >
                                            Fayl qo'shish
                                        </button>
      </el-collapse-item>
      <el-collapse-item title="Topshiriqlar" name="2">
        <div class="overflow-hidden overflow-x-auto">
            <table v-if="useLesson.store.lesson_data.assignments?.length">
                                            <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Nomi</th>
                                                    <th>Tavsifi</th>
                                                    <th>Max ball</th>
                                                    <th class="text-center"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-for="data in useLesson.store.lesson_data.assignments" :key="data.id">
                                                    <tr>
                                                        <td @click="nextAttachment(data.id)" class="cursor-pointer whitespace-nowrap">#{{ data.id }}</td>
                                                        <td @click="nextAttachment(data.id)" class="cursor-pointer">{{ data.name }}</td>
                                                        <td @click="nextAttachment(data.id)" class="cursor-pointer" v-html="data.description"></td>
                                                        <td @click="nextAttachment(data.id)" class="cursor-pointer">{{ data.max_score }}</td>
                                                        <td class="text-center">
                                                            <ul class="flex items-center justify-center gap-3">
                                                                <li
                                                                    v-if="isLoading.store.permissions?.includes('Edit Assignment')"
                                                                    @click="handleTahrirlashAssign(data)"
                                                                >
                                                                    <client-only>
                                                                        <a href="javascript:;" v-tippy:edit>
                                                                            <icon-pencil class="text-success" />
                                                                        </a>
                                                                    </client-only>
                                                                </li>
                                                                <li
                                                                    v-if="isLoading.store.permissions?.includes('Delete Assignment')"
                                                                    @click="handleDeleteAssign(data.id)"
                                                                >
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
                                        <div class="p-5" v-for="(i, index) in useLesson.create.assignments">
                                            <div class="custom-file-container" data-upload-id="myFirstImage">
                                                <h1>Topshiriq nomi</h1>
                                                <input
                                                    v-model="useLesson.create.assignments[index].name"
                                                    type="text"
                                                    placeholder="Nomi"
                                                    class="form-input mb-4"
                                                />
                                                <h1>Max ball</h1>
                                                <input
                                                    v-model="useLesson.create.assignments[index].max_score"
                                                    type="number"
                                                    placeholder="Max ball"
                                                    class="form-input mb-4"
                                                />
                                                <div class="mb-5">
                                                    <h1>Tavsifi</h1>
                                                    <client-only>
                                                        <quillEditor
                                                            ref="editor"
                                                            v-model:value="useLesson.create.assignments[index].description"
                                                            :options="options1"
                                                            style="min-height: 100px"
                                                        ></quillEditor>
                                                    </client-only>
                                                </div>
                                            </div>
                                            <button @click="() => removeAssignment(index)" type="button" class="w-full rounded-md border border-primary py-1">
                                                Topshiriqni o'chirish
                                            </button>
                                            <hr />
                                        </div>
                                        <button @click="addAssignment" type="button" class="w-full rounded-md border border-primary py-1">
                                            Topshiriq qo'shish
                                        </button>
      </el-collapse-item>
    </el-collapse>
  </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useLesson.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useLesson.modal.edit">Saqlash</p>
                                            <p v-else>Qo'shish</p>
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                            <DialogPanel v-else class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useAssignments.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Kursni <span v-if="useAssignments.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useAssignments.createAssignment" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <h1>Topshiriq nomi</h1>
                                        <input
                                            @input="handleAssignmentName"
                                            v-model="useAssignments.create.name"
                                            type="text"
                                            placeholder="Nomi"
                                            class="form-input mb-4"
                                        />
                                        <h1>Max ball</h1>
                                        <input
                                            @input="handleAssignmentName"
                                            v-model="useAssignments.create.max_score"
                                            type="number"
                                            placeholder="Nomi"
                                            class="form-input mb-4"
                                        />
                                        <div class="mb-5">
                                            <h1>Tavsifi</h1>
                                            <client-only>
                                                <quillEditor
                                                    ref="editor"
                                                    v-model:value="useAssignments.create.description"
                                                    :options="options1"
                                                    style="min-height: 100px"
                                                ></quillEditor>
                                            </client-only>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useAssignments.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useAssignments.modal.edit">Saqlash</p>
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

    <TransitionRoot appear :show="useLesson.modal.delete" as="template">
        <Dialog as="div" @close="useLesson.modal.delete = false" class="relative z-[51]">
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
                                @click="useLesson.modal.delete = false"
                            >
                                <icon-x />
                            </button>
                            <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Darsni o'chirish
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                    <icon-trash-lines class="mx-auto h-7 w-7" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu darsni o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger" @click="useLesson.modal.delete = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useLesson.deleteLesson">O'chirish</button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="useAssignments.modal.delete" as="template">
        <Dialog as="div" @close="useAssignments.modal.delete = false" class="relative z-[51]">
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
                                @click="useAssignments.modal.delete = false"
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
                                    <button type="button" class="btn btn-outline-danger" @click="useAssignments.modal.delete = false">Bekor qilish</button>
                                    <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useAssignments.deleteAssignment">O'chirish</button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

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
    // import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    import 'vue3-quill/lib/vue3-quill.css';
    const router = useRouter();
    import { useLessonStore,useAttachmentsStore,  useAssignmentsStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Darslar' });
    const useLesson = useLessonStore();
    const useAssignments = useAssignmentsStore();
    const useAttachments = useAttachmentsStore();
    const isLoading = useLoadingStore();
    isLoading.store.page_name = 'lessons';

    // if(!isLoading.store.permissions?.includes('View Lesson')) {
    //     router.push("/");
    // }

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });

    function removeAssignment(index) {
        useLesson.store.assignment_step -= 1;
        useLesson.create.assignments.splice(index, 1);
    }

    function addAssignment() {
        if (!useLesson.create.assignments) {
            useLesson.create.assignments = [];
        }
        useLesson.create.assignments.push({
            name: '',
            description: '',
            lesson_id: '',
            max_score: '',
        });
        useLesson.store.assignment_step += 1;
    }

    function removeFile(index) {
        if (!useLesson.create.attachments) {
            useLesson.create.attachments = [];
        }
        useLesson.store.attachment_step -= 1;
        useLesson.create.attachments.length = useLesson.store.attachment_step;
    }

    function handleAttachment(e, index) {
        if (!useLesson.create.attachments) {
            useLesson.create.attachments = [];
        }
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        useLesson.create.attachments.push(file);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    }

    function handleTahrirlashAssign(data) {
        useAssignments.store.assignment_id = data.id;
        for (let i in useAssignments.create) {
            useAssignments.create[i] = data[i];
        }
        useAssignments.modal.create = true;
        useAssignments.modal.edit = true;
    }

    function handleTahrirlash(data) {
        useLesson.store.lesson_id = data.id;
        useLesson.getLessonById();
        for (let i in useLesson.create) {
            useLesson.create[i] = data[i];
        }
        useLesson.modal.create = true;
        useLesson.modal.edit = true;
    }

    function handleDelete(id) {
        useLesson.store.lesson_id = id;
        useLesson.modal.delete = true;
    }

    function handleDeleteAssign(id) {
        useAssignments.store.assignment_id = id;
        useAssignments.modal.delete = true;
    }

    function handleDeleteAttach(id) {
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

    onBeforeMount(() => {
        useLesson.getLessons();
    });

    watch(
        () => useLesson.modal.create,
        async () => {
            if (!useLesson.modal.create) {
                useLesson.clearData();
                useLesson.modal.edit = false;
            }
        }
    );
</script>
