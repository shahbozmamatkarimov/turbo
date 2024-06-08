<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getStaffs')">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Xodimlar</h5>
            <div class="flex items-center justify-center">
                <button v-if="isLoading.store.permissions?.includes('Create Employee')" type="button" class="btn btn-info" @click="useStaff.modal.create = true">+ Qo'shish</button>
            </div>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Ism</th>
                            <th>Telefon raqami</th>
                            <th>Roli</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in useStaff.store.staffs" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td>{{ data.name }}</td>
                                <td>{{ data.phone }}</td>
                                <td>{{ data.type }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit Employee')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Employee')" @click="handleDelete(data.id)">
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
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getStaffs') && !useStaff.store.staffs.length">Ma'lumotlar yo'q</div>
        <Pagination class="mt-4" />
    </div>

    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="useStaff.modal.create" as="template">
            <Dialog as="div" @close="useStaff.modal.create = false" class="relative z-[52]">
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
                                    @click="useStaff.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Xodimni <span v-if="useStaff.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useStaff.createStaff" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useStaff.create.name" type="text" placeholder="Ism" class="form-input mb-4" required />
                                        <input
                                            @input="phoneMask"
                                            v-model="useStaff.create.phone"
                                            type="tel"
                                            placeholder="Telefon raqam"
                                            class="form-input mb-4"
                                            required
                                            pattern="+[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]{2}-[0-9]{2}"
                                        />
                                        <input v-if="!useStaff.modal.edit" v-model="useStaff.create.password" type="text" placeholder="Parol" class="form-input mb-4" />
                                        <input
                                        v-if="!useStaff.modal.edit"
                                            v-model="useStaff.create.password_confirmation"
                                            type="text"
                                            placeholder="Parolni takrorlang"
                                            class="form-input mb-4"
                                        />
                                        <client-only>
                                            <multiselect
                                                v-model="useStaff.store.role_data"
                                                :options="useRole.store.roles"
                                                class="custom-multiselect"
                                                :searchable="true"
                                                :preselect-first="true"
                                                track-by="name"
                                                label="name"
                                                :allow-empty="false"
                                                selected-label=""
                                                select-label=""
                                                deselect-label=""
                                            ></multiselect>
                                        </client-only>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useStaff.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" @click="useStaff.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useStaff.modal.edit">Saqlash</p>
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

        <!-- delete -->
        <TransitionRoot appear :show="useStaff.modal.delete" as="template">
            <Dialog as="div" @close="useStaff.modal.delete = false" class="relative z-[51]">
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
                                    @click="useStaff.modal.delete = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Xodimni o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="useStaff.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useStaff.deleteStaff">O'chirish</button>
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
    import { useStaffStore, useLoadingStore, useRoleStore } from '@/stores';
    useHead({ title: 'Xodimlar' });
    const useStaff = useStaffStore();
    const useRole = useRoleStore();
    const router = useRouter();
    const isLoading = useLoadingStore();
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', isLoading.store.pagination.current_page);
    isLoading.store.page_name = 'staff';

    if(!isLoading.store.permissions?.includes('View Employee')) {
        router.push("/");
    }

    function handleTahrirlash(data) {
        useStaff.store.staff_id = data.id;
        for (let i in useStaff.create) {
            useStaff.create[i] = data[i];
        }
        for (let i of useRole.store.roles) {
            if (i.name == data.type) {
                useStaff.store.role_data = i;
                break;
            }
        }
        useStaff.modal.create = true;
        useStaff.modal.edit = true;
    }

    function handleDelete(id) {
        useStaff.store.staff_id = id;
        useStaff.modal.delete = true;
    }

    function phoneMask() {
        useStaff.create.phone = isLoading.phoneMask(useStaff.create.phone);
    }

    watch(
        () => useStaff.modal.create,
        async () => {
            if (!useStaff.modal.create) {
                useStaff.modal.edit = false;
                useStaff.clearData();
            }
        }
    );

    onBeforeMount(() => {
        useStaff.getStaffs();
        useRole.getRoles();
    });
</script>
