<template>
    <!-- Modal -->
    <client-only>
        <section>
            <div @close="$router.currentRoute.value.params.type == 'create'">
                <div class="panel w-full">
                    <h5 @click="$router.back()" class="flex items-center cursor-pointer gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                <div
                                    class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Kurs <span v-if="$router.currentRoute.value.params.type == 'edit'">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
            </h5>
                                <button type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useCourses.modal.create = false">
                                    <icon-x />
                                </button>
                                <div class="flex w-full">
                                    <div class="w-full">
                                        <form @submit.prevent="useCourses.createCourse" class="p-5">
                                            <div class="custom-file-container" data-upload-id="myFirstImage">
                                                <h1>Kurs nomi</h1>
                                                <input @input="handleCourseName" v-model="useCourses.create.name"
                                                    type="text" placeholder="Nomi" class="form-input mb-4" required />
                                                <h1>Narx</h1>
                                                <input v-model="useCourses.create.price" type="number"
                                                    placeholder="Narxi" class="form-input mb-4" required />
                                                <div class="mb-5">
                                                    <h1>Tavsifi</h1>
                                                    <client-only>
                                                        <quillEditor ref="editor"
                                                            v-model:value="useCourses.create.description"
                                                            :options="options1" style="min-height: 100px"></quillEditor>
                                                    </client-only>
                                                </div>
                                                <div class="mb-5">
                                                    <h1>Qisqa tavsifi</h1>
                                                    <client-only>
                                                        <quillEditor ref="editor"
                                                            v-model:value="useCourses.create.excerpt"
                                                            :options="options1" class="excerpt_editor"></quillEditor>
                                                    </client-only>
                                                </div>
                                                <div>
                                                    <h1>Max talabalar soni</h1>
                                                    <input v-model="useCourses.create.max_students" type="number"
                                                        placeholder="Talabalar soni" class="form-input mb-4" />
                                                    <p class="-mt-3 mb-2 text-xs">
                                                        <icon-warning />Ushbu kursga yozilishi mumkin bo'lgan talabalar
                                                        soni. Cheklovsiz 0 ni belgilang.
                                                    </p>
                                                </div>
                                                <div class="mb-5">
                                                    <h1>Qiyinlik darajasi</h1>
                                                    <client-only>
                                                        <multiselect v-model="useCourses.create.level"
                                                            :options="course_options" class="custom-multiselect"
                                                            :searchable="false" :preselect-first="true"
                                                            :allow-empty="false" selected-label="" select-label=""
                                                            deselect-label="">
                                                        </multiselect>
                                                    </client-only>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <p class="my-5">Public</p>
                                                    <el-switch @change="handleShowAds"
                                                        v-model="useCourses.create.course_type" />
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <p class="my-5">Q&A</p>
                                                    <el-switch @change="handleShowAds"
                                                        v-model="useCourses.create.show_ads" />
                                                </div>
                                                <div class="mb-5">
                                                    <h1>Men nimani o'rganaman?</h1>
                                                    <client-only>
                                                        <quillEditor ref="editor"
                                                            v-model:value="useCourses.create.learn" :options="options1"
                                                            class="excerpt_editor"></quillEditor>
                                                    </client-only>
                                                </div>
                                                <div class="mb-5">
                                                    <h1>Maqsadli auditoriya</h1>
                                                    <client-only>
                                                        <quillEditor ref="editor"
                                                            v-model:value="useCourses.create.audience"
                                                            :options="options1" class="excerpt_editor"></quillEditor>
                                                    </client-only>
                                                </div>
                                                <client-only>
                                                    <p>Kurs davomiyligi</p>
                                                    <div class="mb-5 flex gap-5">
                                                        <multiselect v-model="useCourses.store.duration[0]"
                                                            :options="hours_list" class="custom-multiselect"
                                                            :searchable="true" :preselect-first="true"
                                                            :allow-empty="false" selected-label="" select-label=""
                                                            deselect-label="">
                                                        </multiselect>
                                                        <multiselect v-model="useCourses.store.duration[1]"
                                                            :options="minutes_list" class="custom-multiselect"
                                                            :searchable="true" :preselect-first="true"
                                                            :allow-empty="false" selected-label="" select-label=""
                                                            deselect-label="">
                                                        </multiselect>
                                                    </div>
                                                </client-only>
                                                <div class="mb-5">
                                                    <h1>Kiritilgan materiallar</h1>
                                                    <client-only>
                                                        <quillEditor ref="editor"
                                                            v-model:value="useCourses.create.materials"
                                                            :options="options1" style="min-height: 100px"></quillEditor>
                                                    </client-only>
                                                </div>
                                                <div class="mb-5">
                                                    <h1>Talablar/ko'rsatmalar</h1>
                                                    <client-only>
                                                        <quillEditor ref="editor"
                                                            v-model:value="useCourses.create.requirements"
                                                            :options="options1" class="excerpt_editor"></quillEditor>
                                                    </client-only>
                                                </div>
                                                <h1>Qisqa nom</h1>
                                                <input v-model="useCourses.create.suffix" type="text"
                                                    placeholder="Qisqa nom" class="form-input mb-4" />
                                                <h1>Chegirma</h1>
                                                <input v-model="useCourses.create.discount" type="number"
                                                    placeholder="Chegirma" class="form-input mb-4" />
                                                <h1>Link</h1>
                                                <input v-model="useCourses.create.trailer" type="text"
                                                    placeholder="Link" class="form-input mb-4" />
                                                <h1>Oy</h1>
                                                <input v-model="useCourses.create.month_number" type="number"
                                                    placeholder="Oy" class="form-input mb-4" />
                                                <div class="label-container">
                                                    <label>Yuklash </label>
                                                    <a href="javascript:;" class="custom-file-container__image-clear"
                                                        title="Clear Image">×</a>
                                                </div>
                                                <label class="custom-file-container__custom-file">
                                                    <input id="fileupload" @change="handleFileUpload" type="file"
                                                        class="custom-file-container__custom-file__custom-file-input"
                                                        accept="image/*" />
                                                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                                                    <span
                                                        class="custom-file-container__custom-file__custom-file-control ltr:pr-20 rtl:pl-20"></span>
                                                </label>
                                                <label for="fileupload"
                                                    class="custom-file-container__image-preview"></label>
                                            </div>

                                            <div class="mt-8 flex items-center justify-end">
                                                <button type="button" @click="useCourses.modal.create = false"
                                                    class="btn btn-outline-danger">
                                                    Bekor qilish
                                                </button>
                                                <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    <p v-if="useCourses.modal.edit">Saqlash</p>
                                                    <p v-else>Qo'shish</p>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div v-if="$router.currentRoute.value.params.type == 'edit'" class="w-full pr-5">
                                        <div class="flex items-center justify-between w-full pb-2">
                                            <p>Modullar</p>
                                            <p @click="handleAdd('module')">
                                                <icon-plus
                                                    class="bg-primary w-7 h-7 p-0.5 text-white rounded-md cursor-pointer" />
                                            </p>
                                        </div>
                                        <ul v-for="(modul, index) in useCourses.store.course_data" class="mb-3 ml-4">
                                            <el-collapse v-model="useLesson.create.module_id" accordion>
                                                <el-collapse-item :name="modul.id">
                                                    <template #title>
                                                        <p>
                                                            {{ modul.name + ` (${modul.lessons?.length})` }}</p>
                                                        <ul class="ml-4 flex items-center justify-center gap-3">
                                                            <li v-if="isLoading.store.permissions?.includes('Edit Module')"
                                                                @click="handleTahrirlash(modul, 'module')">
                                                                <client-only>
                                                                    <a href="javascript:;" v-tippy:edit>
                                                                        <icon-pencil class="text-success" />
                                                                    </a>
                                                                </client-only>
                                                            </li>
                                                            <li v-if="isLoading.store.permissions?.includes('Delete Module')"
                                                                @click="handleDelete(modul.id, 'module')">
                                                                <client-only>
                                                                    <a href="javascript:;" v-tippy:delete>
                                                                        <icon-trash-lines class="text-danger" />
                                                                    </a>
                                                                </client-only>
                                                            </li>
                                                        </ul>
                                                    </template>
                                                    <div class="flex justify-between w-full pb-2">
                                                        <p>Darslar</p>
                                                        <p @click="handleAdd('lesson')">
                                                            <icon-plus
                                                                class="bg-primary text-white w-6 h-6 p-0.5 rounded-md cursor-pointer" />
                                                        </p>
                                                    </div>
                                                    <el-collapse v-model="useAttachment.create.lesson_id"
                                                        v-if="modul.lessons?.length" accordion>
                                                        <ul v-for="(lesson) in modul.lessons" class="mb-3 ml-4">
                                                            <el-collapse-item :name="lesson.id">
                                                                <template #title>
                                                                    <p>
                                                                        {{ lesson.title + `
                                                                        (${lesson.attachments?.length +
        lesson.assignments?.length})` }}</p>
                                                                    <ul
                                                                        class="ml-4 flex items-center justify-center gap-3">
                                                                        <li v-if="isLoading.store.permissions?.includes('Edit Module')"
                                                                            @click="handleTahrirlash(lesson, 'lesson')">
                                                                            <client-only>
                                                                                <a href="javascript:;" v-tippy:edit>
                                                                                    <icon-pencil class="text-success" />
                                                                                </a>
                                                                            </client-only>
                                                                        </li>
                                                                        <li v-if="isLoading.store.permissions?.includes('Delete Module')"
                                                                            @click="handleDelete(lesson.id, 'lesson')">
                                                                            <client-only>
                                                                                <a href="javascript:;" v-tippy:delete>
                                                                                    <icon-trash-lines
                                                                                        class="text-danger" />
                                                                                </a>
                                                                            </client-only>
                                                                        </li>
                                                                    </ul>
                                                                </template>
                                                                <el-collapse accordion class="ml-4">
                                                                    <el-collapse-item title="Filelar" name="1">
                                                                        <ul v-for="(data, index) in lesson.attachments"
                                                                            class="mb-3">
                                                                            <li class="mt-4 flex justify-between">
                                                                                <div class="flex gap-2">
                                                                                    <icon-file
                                                                                        class="h-4.5 w-4.5 min-w-[18px]" />
                                                                                    <p>File</p>
                                                                                </div>
                                                                                <a download target="_blank"
                                                                                    :href="data.file_url"
                                                                                    class="hover:unerdine text-primary">Yuklash</a>
                                                                                <a :href="data.file_url" target="_blank"
                                                                                    class="hover:unerline flex text-primary">Ochish
                                                                                    <icon-open-book
                                                                                        class="h-4.5 w-4.5" />
                                                                                </a>
                                                                            <li v-if="isLoading.store.permissions?.includes('Delete Lesson')"
                                                                                @click="handleDelete(data.id, 'fayl')">
                                                                                <client-only>
                                                                                    <a href="javascript:;"
                                                                                        v-tippy:delete>
                                                                                        <icon-trash-lines
                                                                                            class="text-danger" />
                                                                                    </a>
                                                                                </client-only>
                                                                            </li>
                                                                            </li>
                                                                        </ul>
                                                                        <div v-if="useAttachment.modal.create" class="mb-4 gap-3">
                                                                            <input
                                                                                @change="(e) => handleAttachment(e, index)"
                                                                                type="file" class="form-input" />
                                                                                <div class="mt-8 flex items-center justify-end">
                                                                            <button type="button" @click="useAttachment.modal.create = false"
                                                                                class="btn btn-outline-danger">
                                                                                Bekor qilish
                                                                            </button>
                                                                            <button
                                                                                @click="useAttachment.createAttachment"
                                                                                type="submit"
                                                                                class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                                <p v-if="useModules.modal.edit">Saqlash
                                                                                </p>
                                                                                <p v-else>Qo'shish</p>
                                                                            </button>
                                                                        </div>
                                                                        </div>
                                                                        <button v-if="!useAttachment.modal.create"
                                                                            @click="useAttachment.modal.create = true"
                                                                            type="button"
                                                                            class="w-full rounded-md border border-primary py-1">
                                                                            Fayl qo'shish
                                                                        </button>
                                                                    </el-collapse-item>
                                                                    <el-collapse-item title="Topshiriqlar" name="2">
                                                                        <div class="overflow-hidden overflow-x-auto">
                                                                            <table v-if="lesson.assignments?.length">
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
                                                                                    <template
                                                                                        v-for="data in lesson.assignments"
                                                                                        :key="data.id">
                                                                                        <tr>
                                                                                            <td class="cursor-pointer whitespace-nowrap">
                                                                                                #{{ data.id }}</td>
                                                                                            <td class="cursor-pointer">
                                                                                                {{ data.name }}</td>
                                                                                            <td class="cursor-pointer"
                                                                                                v-html="data.description">
                                                                                            </td>
                                                                                            <td class="cursor-pointer">
                                                                                                {{ data.max_score }}
                                                                                            </td>
                                                                                            <td class="text-center">
                                                                                                <ul
                                                                                                    class="flex items-center justify-center gap-3">
                                                                                                    <li v-if="isLoading.store.permissions?.includes('Edit Assignment')"
                                                                                                        @click="handleTahrirlash(data, 'topshiriq')">
                                                                                                        <client-only>
                                                                                                            <a href="javascript:;"
                                                                                                                v-tippy:edit>
                                                                                                                <icon-pencil
                                                                                                                    class="text-success" />
                                                                                                            </a>
                                                                                                        </client-only>
                                                                                                    </li>
                                                                                                    <li v-if="isLoading.store.permissions?.includes('Delete Assignment')"
                                                                                                        @click="handleDelete(data.id, 'topshiriq')">
                                                                                                        <client-only>
                                                                                                            <a href="javascript:;"
                                                                                                                v-tippy:delete>
                                                                                                                <icon-trash-lines
                                                                                                                    class="text-danger" />
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
                                                                        <div v-if="useAssignment.modal.create" class="p-5">
                                                                            <div class="custom-file-container"
                                                                                data-upload-id="myFirstImage">
                                                                                <h1>Topshiriq nomi</h1>
                                                                                <input
                                                                                    v-model="useAssignment.create.name"
                                                                                    type="text" placeholder="Nomi"
                                                                                    class="form-input mb-4" />
                                                                                <h1>Max ball</h1>
                                                                                <input
                                                                                    v-model="useAssignment.create.max_score"
                                                                                    type="number" placeholder="Max ball"
                                                                                    class="form-input mb-4" />
                                                                                <div class="mb-5">
                                                                                    <h1>Tavsifi</h1>
                                                                                    <client-only>
                                                                                        <quillEditor ref="editor"
                                                                                            v-model:value="useAssignment.create.description"
                                                                                            :options="options1"
                                                                                            style="min-height: 100px">
                                                                                        </quillEditor>
                                                                                    </client-only>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                class="mt-8 flex items-center justify-end">
                                                                                <button type="button" @click="useAssignment.modal.create = false"
                                                                                    class="btn btn-outline-danger">
                                                                                    Bekor qilish
                                                                                </button>
                                                                                <button
                                                                                    @click="useAssignment.createAssignment"
                                                                                    type="submit"
                                                                                    class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                                    <p>Qo'shish</p>
                                                                                </button>
                                                                            </div>
                                                                            <hr />
                                                                        </div>
                                                                        <button v-if="!useAssignment.modal.create" @click="useAssignment.modal.create = true" type="button"
                                                                            class="w-full rounded-md border border-primary py-1">
                                                                            Topshiriq qo'shish
                                                                        </button>
                                                                    </el-collapse-item>
                                                                </el-collapse>
                                                            </el-collapse-item>
                                                        </ul>
                                                    </el-collapse>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </ul>
                                    </div>
                            </div>
                </div>
            </div>
        </section>
    </client-only>

    <TransitionRoot appear :show="useCourses.modal.delete" as="template">
        <Dialog as="div" @close="useCourses.modal.delete = false" class="relative z-[51]">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="useCourses.modal.delete = false">
                                <icon-x />
                            </button>
                            <div
                                class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                <span class="capitalize">{{ store.delete_type }}</span>ni o'chirish
                            </div>
                            <div class="p-5 text-center">
                                <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                    <icon-trash-lines class="mx-auto h-7 w-7" />
                                </div>
                                <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                <div class="mt-8 flex items-center justify-center">
                                    <button type="button" class="btn btn-outline-danger"
                                        @click="useCourses.modal.delete = false">Bekor qilish</button>
                                    <button v-if="store.delete_type == 'course'" type="button"
                                        class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        @click="useCourses.deleteCourse">O'chirish</button>
                                    <button v-else-if="store.delete_type == 'module'" type="button"
                                        class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        @click="useModules.deleteModule">O'chirish</button>
                                    <button v-else-if="store.delete_type == 'lesson'" type="button"
                                        class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        @click="useLesson.deleteLesson">O'chirish</button>
                                    <button v-else-if="store.delete_type == 'fayl'" type="button"
                                        class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        @click="useAttachment.deleteAttachment">O'chirish</button>
                                    <button v-else-if="store.delete_type == 'topshiriq'" type="button"
                                        class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        @click="useAssignment.deleteAssignment">O'chirish</button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- create lesson-->
    <!-- create lesson-->
    <TransitionRoot appear :show="useLesson.modal.create" as="template">
        <Dialog as="div" @close="useLesson.modal.create = false" class="relative z-[51]">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel v-if="store.delete_type == 'module'"
                            class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="useLesson.modal.create = false">
                                <icon-x />
                            </button>
                            <div
                                class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Modul <span v-if="useModules.modal.edit">tahrirlash</span>
                                <span v-else>qo'shish</span>
                            </div>
                            <form @submit.prevent="useModules.createModule" class="p-5">
                                <div class="custom-file-container" data-upload-id="myFirstImage">
                                    <input v-model="useModules.create.name" type="text" placeholder="Nomi"
                                        class="form-input mb-4" required />
                                </div>

                                <div class="mt-8 flex items-center justify-end">
                                    <button type="button" @click="useLesson.modal.create = false"
                                        class="btn btn-outline-danger">Bekor qilish</button>
                                    <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        <p v-if="useModules.modal.edit">Saqlash</p>
                                        <p v-else>Qo'shish</p>
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                        <DialogPanel v-else-if="store.delete_type == 'lesson'"
                            v-loading="isLoading.isLoadingType('getLessonById')"
                            class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="useCourses.modal.create = false">
                                <icon-x />
                            </button>
                            <div
                                class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Dars <span v-if="$router.currentRoute.value.params.type == 'edit'">tahrirlash</span>
                                <span v-else>qo'shish</span>
                            </div>
                            <form @submit.prevent="useLesson.createLesson" class="p-5">
                                <div data-upload-id="myFirstImage">
                                    <h1>Dars nomi</h1>
                                    <input v-model="useLesson.create.title" type="text" placeholder="Nomi"
                                        class="form-input mb-4" required />
                                </div>
                                <div>
                                    <h1>Tavsifi</h1>
                                    <quillEditor ref="editor" v-model:value="useLesson.create.description"
                                        :options="options1" style="min-height: 100px"></quillEditor>
                                </div>
                                <div class="mt-4">
                                    <h1>Video link</h1>
                                    <input v-model="useLesson.create.video" type="url" placeholder="link"
                                        class="form-input mb-4" />
                                </div>
                                <div>
                                    <h1>Dars davomiyligi</h1>
                                    <input v-model="useLesson.create.duration" type="text"
                                        placeholder="Dars davomiyligi" class="form-input mb-4" />
                                </div>
                                <hr class="mb-3 mt-5 border border-red-600" />
                                <div class="demo-collapse">
                                    <el-collapse accordion>
                                        <el-collapse-item title="Filelar" name="1">
                                            <ul v-for="(data, index) in useLesson.store.lesson_data.attachments"
                                                class="mb-3">
                                                <!-- <input @change="(e) => handleAttachment(e, index)" type="file" class="form-input mb-4" /> -->
                                                <li class="mt-4 flex justify-between">
                                                    <div class="flex gap-2">
                                                        <icon-file class="h-4.5 w-4.5 min-w-[18px]" />
                                                        <p>File</p>
                                                    </div>
                                                    <a download target="_blank" :href="data.file_url"
                                                        class="hover:unerdine text-primary">Yuklash</a>
                                                    <a :href="data.file_url" target="_blank"
                                                        class="hover:unerline flex text-primary">Ochish
                                                        <icon-open-book class="h-4.5 w-4.5" />
                                                    </a>
                                                <li v-if="isLoading.store.permissions?.includes('Delete Lesson')"
                                                    @click="handleDeleteAttach(data.id)">
                                                    <client-only>
                                                        <a href="javascript:;" v-tippy:delete>
                                                            <icon-trash-lines class="text-danger" />
                                                        </a>
                                                    </client-only>
                                                </li>
                                                </li>
                                            </ul>
                                            <div class="mb-4 flex items-center gap-3"
                                                v-for="(i, index) in useLesson.store.attachment_step">
                                                <input @change="(e) => handleAttachment(e, index)" type="file"
                                                    class="form-input" />
                                                <icon-minus-circle @click="() => removeFile(index)"
                                                    class="cursor-pointer" />
                                            </div>
                                            <button @click="useLesson.store.attachment_step += 1" type="button"
                                                class="w-full rounded-md border border-primary py-1">
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
                                                        <template
                                                            v-for="data in useLesson.store.lesson_data.assignments"
                                                            :key="data.id">
                                                            <tr>
                                                                <td @click="nextAttachment(data.id)"
                                                                    class="cursor-pointer whitespace-nowrap">#{{ data.id
                                                                    }}</td>
                                                                <td @click="nextAttachment(data.id)"
                                                                    class="cursor-pointer">{{ data.name }}</td>
                                                                <td @click="nextAttachment(data.id)"
                                                                    class="cursor-pointer" v-html="data.description">
                                                                </td>
                                                                <td @click="nextAttachment(data.id)"
                                                                    class="cursor-pointer">{{ data.max_score }}</td>
                                                                <td class="text-center">
                                                                    <ul class="flex items-center justify-center gap-3">
                                                                        <li v-if="isLoading.store.permissions?.includes('Edit Assignment')"
                                                                            @click="handleTahrirlash(data, 'topshiriq')">
                                                                            <client-only>
                                                                                <a href="javascript:;" v-tippy:edit>
                                                                                    <icon-pencil class="text-success" />
                                                                                </a>
                                                                            </client-only>
                                                                        </li>
                                                                        <li v-if="isLoading.store.permissions?.includes('Delete Assignment')"
                                                                            @click="handleDeleteAssign(data.id)">
                                                                            <client-only>
                                                                                <a href="javascript:;" v-tippy:delete>
                                                                                    <icon-trash-lines
                                                                                        class="text-danger" />
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
                                                    <input v-model="useLesson.create.assignments[index].name"
                                                        type="text" placeholder="Nomi" class="form-input mb-4" />
                                                    <h1>Max ball</h1>
                                                    <input v-model="useLesson.create.assignments[index].max_score"
                                                        type="number" placeholder="Max ball" class="form-input mb-4" />
                                                    <div class="mb-5">
                                                        <h1>Tavsifi</h1>
                                                        <client-only>
                                                            <quillEditor ref="editor"
                                                                v-model:value="useLesson.create.assignments[index].description"
                                                                :options="options1" style="min-height: 100px">
                                                            </quillEditor>
                                                        </client-only>
                                                    </div>
                                                </div>
                                                <button @click="() => removeAssignment(index)" type="button"
                                                    class="w-full rounded-md border border-primary py-1">
                                                    Topshiriqni o'chirish
                                                </button>
                                                <hr />
                                            </div>
                                            <button @click="addAssignment" type="button"
                                                class="w-full rounded-md border border-primary py-1">
                                                Topshiriq qo'shish
                                            </button>
                                        </el-collapse-item>
                                    </el-collapse>
                                </div>

                                <div class="mt-8 flex items-center justify-end">
                                    <button type="button" @click="useLesson.modal.create = false"
                                        class="btn btn-outline-danger">Bekor qilish</button>
                                    <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        <p v-if="$router.currentRoute.value.params.type == 'edit'">Saqlash</p>
                                        <p v-else>Qo'shish</p>
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                        <DialogPanel v-else-if="store.delete_type == 'topshiriq'" class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useAssignment.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Topshiriqni <span v-if="useAssignment.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useAssignment.createAssignment" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <h1>Topshiriq nomi</h1>
                                        <input
                                            @input="handleAssignmentName"
                                            v-model="useAssignment.create.name"
                                            type="text"
                                            placeholder="Nomi"
                                            class="form-input mb-4"
                                            required
                                        />
                                        <h1>Max ball</h1>
                                        <input
                                            @input="handleAssignmentName"
                                            v-model="useAssignment.create.max_score"
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
                                                    v-model:value="useAssignment.create.description"
                                                    :options="options1"
                                                    style="min-height: 100px"
                                                ></quillEditor>
                                            </client-only>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useAssignment.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useAssignment.modal.edit">Saqlash</p>
                                            <p v-else>Qo'shish</p>
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        <DialogPanel v-else
                            class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="useLesson.modal.create = false">
                                <icon-x />
                            </button>
                            <div
                                class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                Dars <span v-if="useAssignment.modal.edit">tahrirlash</span>
                                <span v-else>qo'shish</span>
                            </div>
                            <form @submit.prevent="useLesson.createLesson" class="p-5">
                                <div data-upload-id="myFirstImage">
                                    <h1>Dars nomi</h1>
                                    <input v-model="useLesson.create.title" type="text" placeholder="Nomi"
                                        class="form-input mb-4" required />
                                </div>
                                <div>
                                    <h1>Tavsifi</h1>
                                    <quillEditor ref="editor" v-model:value="useLesson.create.description"
                                        :options="options1" style="min-height: 100px"></quillEditor>
                                </div>
                                <div class="mt-4">
                                    <h1>Video link</h1>
                                    <input v-model="useLesson.create.video" type="url" placeholder="link"
                                        class="form-input mb-4" />
                                </div>
                                <div>
                                    <h1>Dars davomiyligi</h1>
                                    <input v-model="useLesson.create.duration" type="text"
                                        placeholder="Dars davomiyligi" class="form-input mb-4" />
                                </div>
                                <div class="mt-8 flex items-center justify-end">
                                    <button type="button" @click="useLesson.modal.create = false"
                                        class="btn btn-outline-danger">Bekor qilish</button>
                                    <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        <p v-if="useAssignment.modal.edit">Saqlash</p>
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
const useAssignment = useAssignmentsStore()
const useModules = useModulesStore();
isLoading.store.page_name = 'courses';

const options1 = ref({
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ],
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
})

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
    useLesson.modal.create = true
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
        } catch (_) { }
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
        else if (type == 'lesson') {
            useLesson.store.lesson_id = data.id;
            for (let i in useLesson.create) {
                useLesson.create[i] = data[i];
            }
            useLesson.modal.edit = true;
        } else if (type == 'topshiriq') {
            useAssignment.store.assignment_id = data.id;
            for (let i in useAssignment.create) {
                useAssignment.create[i] = data[i];
            }
            useAssignment.modal.edit = true;
        }
        useLesson.modal.create = true;
    }
}

function handleDelete(id, type) {
    store.delete_type = type;
    console.log(type);
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

function handleFileUpload(e) {
    useCourses.create.image = e.target.files[0];
}

function handleAttachment(e, index) {
    if (!useLesson.create.attachments) {
        useLesson.create.attachments = [];
    }
    const file = e.target.files[0];
    useAttachment.create.file = file;
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

onBeforeMount(() => {
    useCourses.getCourseData();
});

watch(
    () => useCourses.modal.create,
    async () => {
        if (useCourses.modal.create) {
            const fileupload = await
                import('file-upload-with-preview');
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

watch(() => useAttachment.create.lesson_id, () => {
    console.log(useAttachment.create.lesson_id)
    console.log(useAssignment.create.lesson_id, 'dksldjskldk')
    useAssignment.create.lesson_id = useAttachment.create.lesson_id;
})

watch(() => useLesson.modal.create, () => {
    if (!useLesson.modal.create) {
        useLesson.modal.edit = false;
        useModules.modal.edit = false;
        useAssignment.modal.edit =false;
    }
})
</script>
