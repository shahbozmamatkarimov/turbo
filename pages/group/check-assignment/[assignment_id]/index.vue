<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getCheck')">
        <div class="mb-5 flex items-center justify-between">
            <h5 @click="$router.back()" class="flex items-center cursor-pointer gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                Topshiriqlarni tekshirish
            </h5>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>User</th>
                            <th>Javob</th>
                            <th>Ball</th>
                            <th>Topshiriq</th>
                            <!-- <th class="text-center"></th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(data, index) in useCheck.store.check" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td class="">
                                    <ul class="flex items-center gap-3">
                                        <li v-if="data.user.image">
                                            <img class="h-6 w-6 rounded-full" :src="data.user.image" alt="" />
                                        </li>
                                        <li>
                                            {{ data.user.name }}
                                            {{ data.user.last_name }}
                                        </li>
                                    </ul>
                                </td>
                                <td class="">{{ data.answer }}</td>
                                <td class="flex items-center gap-3" @click="handleTahrirlash(data)">
                                    {{ data.points }}
                                    <client-only >
                                        <a href="javascript:;" v-tippy:edit>
                                            <icon-edit class="text-success" />
                                        </a>
                                    </client-only>
                                </td>
                                <td class="">{{ data.assignment.name }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getCheck') && !useCheck.store.check.length">Ma'lumotlar yo'q</div>
        <Pagination class="mt-4" />
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create and update -->
        <TransitionRoot appear :show="useCheck.modal.create" as="template">
            <Dialog as="div" @close="useCheck.modal.create = false" class="relative z-[52]">
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
                                    @click="useCheck.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Ballni <span v-if="useCheck.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useCheck.updateCheck" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <p>Ball ( Max ball {{ useCheck.store.max_point }})</p>
                                        <input v-model="useCheck.create.points" type="number" placeholder="Ball" class="form-input mb-4" />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useCheck.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useCheck.modal.edit">Saqlash</p>
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
    </client-only>
</template>
<script setup>
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
    import Multiselect from '@suadelabs/vue3-multiselect';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    import { useCheckStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Balllar' });
    const useCheck = useCheckStore();
    const router = useRouter();
    const isLoading = useLoadingStore();

    const minutes_list = [];
    for (let i = 1; i <= 60; i++) {
        minutes_list.push(i < 10 ? '0' + i : i);
    }

    isLoading.store.pagination.current_page = router.currentRoute.value.query.page | 1;
    isLoading.changeQuery('page', router.currentRoute.value.query.page | 1);

    const hours_list = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    isLoading.store.page_name = 'check_assignments';

    if (!isLoading.store.permissions?.includes('View Check')) {
        // router.push("/");
    }

    function handleTahrirlash(data) {
        useCheck.store.check_id = data.id;
        useCheck.store.max_point = data.assignment.max_score;
        for (let i in useCheck.create) {
            useCheck.create[i] = data[i];
        }
        if (data.hour) {
            useCheck.create.hour = data.hour.split(':');
            useCheck.create.hour.length = 2;
        } else {
            useCheck.create.hour = [];
        }
        useCheck.modal.create = true;
        useCheck.modal.edit = true;
    }

    function handleDelete(id) {
        useCheck.store.check_id = id;
        useCheck.modal.delete = true;
    }

    function phoneMask() {
        useCheck.create.phone = isLoading.phoneMask(useCheck.create.phone);
    }

    watch(
        () => useCheck.modal.create,
        async () => {
            if (!useCheck.modal.create) {
                useCheck.modal.edit = false;
                useCheck.clearData();
            }
        }
    );

    onBeforeMount(() => {
        useCheck.getCheck();
    });
</script>
