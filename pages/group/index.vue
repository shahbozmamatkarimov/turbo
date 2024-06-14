<template>
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Guruhlar</h5>
            <div class="flex items-center justify-center">
                <!-- <button v-if="isLoading.store.permissions?.includes('Create Group')" type="button" class="btn btn-info" @click="useGroup.modal.create = true">+ Qo'shish</button> -->
                <button type="button" class="btn btn-info" @click="useGroup.modal.create = true">+ Qo'shish</button>
                <div class="flex items-center gap-2">
                </div>
                <div class="flex rounded-md bg-[#027DFC1A] duration-1000 ml-4">
                    <button @click="store.is_delete = false" :class="store.is_delete ? '' : 'bg-[#027DFC] text-white'"
                        class="flex justify-center items-center h-9 w-9 rounded-md duration-700">
                        <icon-box />
                    </button>
                    <button @click="store.is_delete = true" :class="!store.is_delete ? '' : 'bg-[#027DFC] text-white'"
                        class="flex justify-center items-center h-9 w-9 rounded-md duration-700">
                        <!-- <img class="mx-auto w-6" v-show="!store.is_delete" src="@/assets/svg/grid.svg" alt="" /> -->
                        <!-- <img class="mx-auto w-6" v-show="store.is_delete" src="@/assets/svg/grid_white.svg" alt="" /> -->
                        <icon-users />
                    </button>
                </div>
            </div>
        </div>
        <div class="mb-5" v-loading="isLoading.isLoadingType('getGroup')">
            <div class="table-responsive" :class="store.is_delete? 'bg-red-50' : ''">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nomi</th>
                            <th>Foydalanuvchilar soni</th>
                            <th>Vaqti</th>
                            <th>Kelish vaqti</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(data, index) in useGroup.store.group" :key="data.id">
                            <tr>
                                <td @click="router.push(`/group/members/${data.id}`)" class="whitespace-nowrap">#{{
                    data.id }}</td>
                                <td @click="router.push(`/group/members/${data.id}`)" class="">{{ data.name }}</td>
                                <td @click="router.push(`/group/members/${data.id}`)" class="">{{ data.max_users }}</td>
                                <td @click="router.push(`/group/members/${data.id}`)" class="">{{ data.hour?.slice(0, 5)
                                    }}</td>
                                <td @click="router.push(`/group/members/${data.id}`)" class="">{{ data.is_primary ?
                    'Ertalab'
                    : 'Peshin' }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="store.is_delete" @click="handleRemoveArchive(data.id)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-refresh class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-else @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-edit class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li @click="handleDelete(data.id)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:delete>
                                                    <icon-trash-lines class="text-danger" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <!-- <li v-if="isLoading.store.permissions?.includes('Edit Group')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Group')" @click="handleDelete(data.id)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:delete>
                                                    <icon-trash-lines class="text-danger" />
                                                </a>
                                            </client-only>
                                        </li> -->
                                    </ul>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="full_flex w-full border py-10"
            v-if="!isLoading.isLoadingType('getGroup') && !useGroup.store.group.length">
            Ma'lumotlar yo'q</div>
        <Pagination class="mt-4" />
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create and update -->
        <TransitionRoot appear :show="useGroup.modal.create" as="template">
            <Dialog as="div" @close="useGroup.modal.create = false" class="relative z-[52]">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <DialogOverlay class="fixed inset-0 bg-[black]/60" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center px-4 py-8">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="panel w-full max-w-lg rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useGroup.modal.create = false">
                                    <icon-x />
                                </button>
                                <div
                                    class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Guruhni <span v-if="useGroup.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useGroup.createGroup" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <p>Guruh nomi</p>
                                        <input v-model="useGroup.create.name" type="text" placeholder="Nomi"
                                            class="form-input mb-4" required />
                                        <p>Kurs nomi</p>
                                        <multiselect v-model="useGroup.store.course_id"
                                            :options="useCourses.store.courses" @input="searchCourses"
                                            class="mb-3 custom-multiselect" :searchable="true" :preselect-first="true"
                                            :allow-empty="false" track-by="name" label="name" selected-label=""
                                            select-label="" deselect-label="">
                                        </multiselect>
                                        <p>Foydalanuvchilar soni</p>
                                        <input v-model="useGroup.create.max_users" type="number"
                                            placeholder="Foydalanuvchilar soni" class="form-input mb-4" required />
                                        <client-only>
                                            <p>Vaqti</p>
                                            <div class="mb-5 flex gap-5">
                                                <multiselect v-model="useGroup.create.hour[0]" :options="hours_list"
                                                    class="custom-multiselect" :searchable="true"
                                                    :preselect-first="true" :allow-empty="false" selected-label=""
                                                    select-label="" deselect-label=""></multiselect>
                                                <multiselect v-model="useGroup.create.hour[1]" :options="minutes_list"
                                                    class="custom-multiselect" :searchable="true"
                                                    :preselect-first="true" :allow-empty="false" selected-label=""
                                                    select-label="" deselect-label=""></multiselect>
                                            </div>
                                        </client-only>
                                        <div class="flex cursor-pointer gap-2">
                                            <input id="group_access" v-model="useGroup.create.is_primary"
                                                type="checkbox" class="h-5 w-5" />
                                            <label for="group_access">{{ useGroup.create.is_primary ?
                    'Ertalab' : 'Peshin' }}</label>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useGroup.modal.create = false"
                                            class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useGroup.modal.edit">Saqlash</p>
                                            <p v-else>Keyingi</p>
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- reload from archive -->
        <TransitionRoot appear :show="useGroup.modal.remove_archive" as="template">
            <Dialog as="div" @close="useGroup.modal.remove_archive = false" class="relative z-[51]">
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
                                    @click="useGroup.modal.remove_archive = false"
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
                                        <button type="button" class="btn btn-outline-danger" @click="useGroup.modal.remove_archive = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useGroup.restoreGroup">Arxivdan chiqarish</button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- delete -->
        <TransitionRoot appear :show="useGroup.modal.delete" as="template">
            <Dialog as="div" @close="useGroup.modal.delete = false" class="relative z-[51]">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <DialogOverlay class="fixed inset-0 bg-[black]/60" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center px-4 py-8">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useGroup.modal.delete = false">
                                    <icon-x />
                                </button>
                                <div
                                    class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    {{ store.is_delete ? "Guruhni arxivdan o'chirish" : "Guruhni o'chirish"}}
                                </div>
                                <div class="p-5 text-center">
                                    <div
                                        class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger"
                                            @click="useGroup.modal.delete = false">Bekor qilish</button>
                                        <button v-if="!store.is_delete" type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            @click="useGroup.deleteGroup">O'chirish</button>
                                            <button v-else type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            @click="useGroup.deleteArchiveGroup">Arxivdan o'chirish</button>
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
import { useGroupStore, useLoadingStore, useCoursesStore } from '@/stores';
useHead({ title: 'Guruhlar' });
const useGroup = useGroupStore();
const useCourses = useCoursesStore();
const router = useRouter();
const isLoading = useLoadingStore();

const store = reactive({
    is_deleted: false,
})

const minutes_list = [];
for (let i = 1; i <= 60; i++) {
    minutes_list.push(i < 10 ? '0' + i : i);
}

const hours_list = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

isLoading.store.page_name = 'group';

if (!isLoading.store.permissions?.includes('View Group')) {
    // router.push("/");
}

function handleTahrirlash(data) {
    console.log(data);
    useGroup.store.group_id = data.id;
    for (let i in useGroup.create) {
        useGroup.create[i] = data[i];
    }
    useGroup.create.is_primary = data.is_primary == 0 ? false : true;
    if (data.hour) {
        useGroup.create.hour = data.hour.split(':');
        useGroup.create.hour.length = 2;
    } else {
        useGroup.create.hour = [];
    }
    useGroup.modal.create = true;
    useGroup.modal.edit = true;
    useCourses.getCourseById(data.course_id);
}

function handleDelete(id) {
    useGroup.store.group_id = id;
    useGroup.modal.delete = true;
}

function handleRemoveArchive(id) {
    useGroup.store.group_id = id;
    useGroup.modal.remove_archive = true;
}

function phoneMask() {
    useGroup.create.phone = isLoading.phoneMask(useGroup.create.phone);
}

function searchCourses(e) {
    useCourses.searchCourses(e.target.value);
}

watch(
    () => useGroup.modal.create,
    async () => {
        if (!useGroup.modal.create) {
            useGroup.modal.edit = false;
            useGroup.clearData();
            useCourses.searchCourses('');
        }
    }
);

watch(() => store.is_delete, () => {
    if (store.is_delete) {
        useGroup.getTrashGroup();
    } else {
        useGroup.getGroup();
    }
})

onBeforeMount(() => {
    useGroup.getGroup();
    useCourses.searchCourses('');
});
</script>
