<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getUsers')">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Foydalanuvchilar</h5>
            <div class="flex items-center justify-center">
                <!-- <button type="button" class="btn btn-info" @click="useUser.modal.create = true">+ add</button> -->
            </div>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Ism</th>
                            <th>Telefon</th>
                            <th>Foydalanuvchi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in useUser.store.users" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td>{{ data.name }} {{ data.last_name }}</td>
                                <td>{{ data.phone }}</td>
                                <td class="flex gap-2">
                                    {{ data.type }}
                                    <icon-edit v-if="isLoading.store.permissions?.includes('Edit User')" @click="handleEditType(data)" class="text-success cursor-pointer" />
                                </td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit User')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete User')" @click="handleDelete(data.id)">
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
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getUsers') && !useUser.store.users?.length">Ma'lumot yo'q</div>
        <Pagination class="mt-4" />
    </div>

    <!-- Modal -->
    <client-only>
        <!-- edit type -->
        <TransitionRoot appear :show="useUser.modal.type" as="template">
            <Dialog as="div" @close="useUser.modal.type = false" class="relative z-[51]">
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
                                    @click="useUser.modal.type = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Foydalanuvchi turini o'zgartirish
                                </div>
                                <form @submit.prevent="useUser.updateUserType" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <div class="mb-5">
                                            <client-only>
                                                <multiselect
                                                    v-model="useUser.create.type"
                                                    :options="user_types"
                                                    class="custom-multiselect"
                                                    :searchable="true"
                                                    :preselect-first="true"
                                                    :allow-empty="true"
                                                    selected-label=""
                                                    select-label=""
                                                    deselect-label=""
                                                ></multiselect>
                                            </client-only>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useUser.modal.type = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" @click="useUser.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p>Saqlash</p>
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- edit password -->
        <TransitionRoot appear :show="useUser.modal.create" as="template">
            <Dialog as="div" @close="useUser.modal.create = false" class="relative z-[51]">
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
                                    @click="useUser.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Foydalanuvchini <span v-if="useUser.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useUser.updateUserPassword" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useUser.create.password" type="text" placeholder="Parol kiriting" class="form-input mb-4" required />
                                        <input
                                            v-model="useUser.create.password_confirmation"
                                            type="text"
                                            placeholder="Parolni takrorlang"
                                            class="form-input mb-4"
                                            required
                                        />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useUser.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useUser.modal.edit">Saqlash</p>
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
        <TransitionRoot appear :show="useUser.modal.delete" as="template">
            <Dialog as="div" @close="useUser.modal.delete = false" class="relative z-[51]">
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
                                    @click="useUser.modal.delete = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Foydalanuvchini o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham bu foydalanuvchini o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="useUser.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useUser.deleteUserById">O'chirish</button>
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
    import { useUserStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Foydalanuvchilar' });
    const useUser = useUserStore();
    const router = useRouter();
    const isLoading = useLoadingStore();
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page | 1);
    isLoading.store.page_name = 'users';

    if(!isLoading.store.userData.type == 'Super Admin') {
        router.push("/");
    }

    const user_types = ['Super Admin', 'Owner', 'Employee', 'Student'];

    function handleTahrirlash(data) {
        useUser.store.user_id = data.id;
        for (let i in useUser.create) {
            useUser.create[i] = data[i];
        }
        useUser.modal.create = true;
        useUser.modal.edit = true;
    }

    function handleEditType(data) {
        useUser.store.user_id = data.id;
        for (let i in useUser.create) {
            useUser.create[i] = data[i];
        }
        useUser.modal.type = true;
    }

    function handleDelete(id) {
        useUser.store.user_id = id;
        useUser.modal.delete = true;
    }

    watch(
        () => useUser.modal.create,
        async () => {
            if (!useUser.modal.create) {
                useUser.modal.edit = false;
                useUser.clearData();
            }
        }
    );
    
    onBeforeMount(() => {
        useUser.getUsers();
    });
</script>
