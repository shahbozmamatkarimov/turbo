<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getRoles')">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Rollar</h5>
            <div class="flex items-center justify-center">
                <button v-if="isLoading.store.permissions?.includes('Create Role')" type="button" class="btn btn-info" @click="useRole.modal.create = true">
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
                            <th>Ism</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in useRole.store.roles" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td>{{ data.name }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit Role')" @click="handleTahrirlash(data, 'show')">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-eye class="text-primary" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Role')" @click="handleTahrirlash(data, 'edit')">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
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
                                    </ul>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getRoles') && !useRole.store.roles.length">Ma'lumotlar yo'q</div>
        <!-- <Pagination /> -->
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create role -->
        <TransitionRoot appear :show="useRole.modal.create" as="template">
            <Dialog as="div" @close="useRole.modal.create = false" class="relative z-[51]">
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
                            <DialogPanel class="panel w-full max-w-2xl rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                    @click="useRole.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Rolni boshqarish
                                </div>
                                <form @submit.prevent="useRole.createRole" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <p>Rol nomi</p>
                                        <input
                                            :disabled="useRole.modal.read ? true : false"
                                            v-model="useRole.create.name"
                                            type="text"
                                            placeholder="Rol nomi"
                                            class="form-input mb-4"
                                            required
                                        />

                                        <div class="table-responsive" v-loading="isLoading.isLoadingType('getPermissions')">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th v-if="!useRole.modal.read" class="ltr:rounded-l-md rtl:rounded-r-md">
                                                            <input @change="allChecked" type="checkbox" class="h-5 w-5" />
                                                        </th>
                                                        <th>Modul</th>
                                                        <th>Ruxsatlar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr
                                                        v-for="(permission, per_index) in Object.keys(useRole.store.permissions_for_user)"
                                                        :key="i"
                                                        class="group text-white-dark hover:text-black dark:hover:text-white-light/90"
                                                    >
                                                        <td v-if="!useRole.modal.read">
                                                            <input @change="(e) => allPermission(e, permission)" type="checkbox" class="h-4 w-4" />
                                                        </td>
                                                        <td class="text-white-dark dark:text-white-light/90">{{ permission }}</td>
                                                        <td>
                                                            <ul class="flex gap-5">
                                                                <li class="flex h-5 gap-2" v-for="(i, index) in useRole.store.permissions_for_user[permission]">
                                                                    <input
                                                                        v-if="!useRole.modal.read"
                                                                        v-model="useRole.store.permissions_for_user[permission][index]"
                                                                        @change="(e) => hanlePermissions(e, permission, index)"
                                                                        type="checkbox"
                                                                        :id="useRole.store.permissions[permission][index]"
                                                                        class="h-4 w-4 cursor-pointer"
                                                                    />
                                                                    <div v-else>
                                                                        <icon-checks class="w-6" v-if="useRole.store.permissions_for_user[permission][index]" />
                                                                        <icon-lock class="w-6" v-else />
                                                                    </div>
                                                                    <label class="cursor-pointer" :for="useRole.store.permissions[permission][index]">{{
                                                                        permissions_types[index]
                                                                    }}</label>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div v-if="!useRole.modal.read" class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useRole.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" @click="useRole.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useRole.modal.edit">Saqlash</p>
                                            <p v-else>Qo'shish</p>
                                        </button>
                                    </div>
                                    <div v-else class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useRole.modal.create = false" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p>Yopish</p>
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
        <TransitionRoot appear :show="useRole.modal.delete" as="template">
            <Dialog as="div" @close="useRole.modal.delete = false" class="relative z-[51]">
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
                                    @click="useRole.modal.delete = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Rolni o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="useRole.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="useRole.deleteRole">O'chirish</button>
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
    import { useRoleStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Rollar' });
    const useRole = useRoleStore();
    const router = useRouter();
    const isLoading = useLoadingStore();
    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', isLoading.store.pagination.current_page);
    isLoading.store.page_name = 'roles';

    if (!isLoading.store.permissions?.includes('View Role')) {
        router.push('/');
    }

    const permissions_types = ["Ko'rish", "Qo'shish", 'Tahrirlash', "O'chirish", 'Yangilash'];

    function allPermission(e, i) {
        const isTrue = e.target.checked;
        const trueData = [isTrue, isTrue, isTrue, isTrue];
        trueData.length = useRole.store.permissions_for_user[i].length;
        useRole.store.permissions_for_user[i] = trueData;
    }

    function hanlePermissions(e, permission, index) {
        if (!e.target.checked && index == 0) {
            const trueData = [false, false, false, false];
            trueData.length = useRole.store.permissions_for_user[permission].length;
            useRole.store.permissions_for_user[permission] = trueData;
        } else if (index != 0 && e.target.checked) {
            useRole.store.permissions_for_user[permission][0] = true;
        }
    }

    function allChecked(e) {
        const isTrue = e.target.checked;
        for (let i of Object.keys(useRole.store.permissions_for_user)) {
            useRole.store.permissions_for_user[i] = [isTrue, isTrue, isTrue, isTrue];
        }
    }

    function handleTahrirlash(data, type) {
        useRole.store.role_id = data.id;
        for (let i in useRole.create) {
            useRole.create[i] = data[i];
        }
        data.permissions = data.permissions || [];
        for (let i of Object.keys(useRole.store.permissions)) {
            useRole.store.permissions_for_user[i] = [];
            for (let j in useRole.store.permissions[i]) {
                let isTrue = false;
                for (let user_info of data.permissions) {
                    if (useRole.store.permissions[i][j] == user_info) {
                        isTrue = true;
                    }
                }
                useRole.store.permissions_for_user[i].push(isTrue);
            }
        }
        useRole.modal.create = true;
        if (type == 'edit') {
            useRole.modal.edit = true;
        } else {
            useRole.modal.read = true;
        }
    }

    function handleDelete(id) {
        useRole.store.role_id = id;
        useRole.modal.delete = true;
    }

    watch(
        () => useRole.modal.create,
        async () => {
            if (!useRole.modal.create) {
                useRole.modal.edit = false;
                useRole.modal.read = false;
                useRole.clearData();
            }
        }
    );

    onBeforeMount(() => {
        useRole.getRoles();
        useRole.getPermissions();
    });
</script>
