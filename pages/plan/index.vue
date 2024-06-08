<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getPlans')">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Tariflar</h5>
            <div class="flex items-center justify-center">
                <button v-if="isLoading.store.permissions?.includes('Create Plan')" type="button" class="btn btn-info" @click="usePlan.modal.create = true">+ Qo'shish</button>
            </div>
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nomi</th>
                            <th>Narxi</th>
                            <th>Oy</th>
                            <th>Access</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="data in usePlan.store.plans" :key="data.id">
                            <tr>
                                <td @click="routeToData(data.id)" class="whitespace-nowrap cursor-pointer">#{{ data.id }}</td>
                                <td @click="routeToData(data.id)" class="cursor-pointer">{{ data.name }}</td>
                                <td @click="routeToData(data.id)" class="cursor-pointer">{{ data.price }}</td>
                                <td @click="routeToData(data.id)" class="cursor-pointer">{{ data.month }}</td>
                                <td @click="routeToData(data.id)" class="cursor-pointer">{{ data.course_access ? true : false }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li v-if="isLoading.store.permissions?.includes('Edit Plan')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Plan')" @click="handleDelete(data.id)">
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
        <div class="full_flex w-full border py-10" v-if="!isLoading.isLoadingType('getPlans') && !usePlan.store.plans.length">Ma'lumotlar yo'q</div>
        <!-- <Pagination class="mt-4" /> -->
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create and update -->
        <TransitionRoot appear :show="usePlan.modal.create" as="template">
            <Dialog as="div" @close="usePlan.modal.create = false" class="relative z-[52]">
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
                                    @click="usePlan.modal.create = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Tarifni <span v-if="usePlan.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="usePlan.createPlan" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="usePlan.create.name" type="text" placeholder="Nomi" class="form-input mb-4" required />
                                        <input v-model="usePlan.create.price" type="number" placeholder="Narxi" class="form-input mb-4" required />
                                        <input v-model="usePlan.create.month" type="number" placeholder="Oyi" class="form-input mb-4" required />
                                        <div class="flex cursor-pointer gap-2">
                                            <input id="course_access" v-model="usePlan.create.course_access" type="checkbox" class="h-5 w-5" />
                                            <label for="course_access">Kursga kirish</label>
                                        </div>
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="usePlan.modal.create = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" @click="usePlan.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="usePlan.modal.edit">Saqlash</p>
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
        <TransitionRoot appear :show="usePlan.modal.delete" as="template">
            <Dialog as="div" @close="usePlan.modal.delete = false" class="relative z-[51]">
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
                                    @click="usePlan.modal.delete = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Tarifni o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger" @click="usePlan.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4" @click="usePlan.deletePlan">O'chirish</button>
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
    import { usePlanStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Tariflar' });
    const usePlan = usePlanStore();
    const router = useRouter();
    const isLoading = useLoadingStore();

    isLoading.store.page_name = 'plan';

    if(!isLoading.store.permissions?.includes('View Plan')) {
        router.push("/");
    }

    function routeToData(id) {
        router.push(`/plan/${id}`);
    }

    function handleTahrirlash(data) {
        usePlan.store.plan_id = data.id;
        for (let i in usePlan.create) {
            usePlan.create[i] = data[i];
        }
        if (data.course_access) {
            usePlan.create.course_access = true;
        } else {
            usePlan.create.course_access = false;
        }
        usePlan.modal.create = true;
        usePlan.modal.edit = true;
    }

    function handleDelete(id) {
        usePlan.store.plan_id = id;
        usePlan.modal.delete = true;
    }

    function phoneMask() {
        usePlan.create.phone = isLoading.phoneMask(usePlan.create.phone);
    }

    watch(
        () => usePlan.modal.create,
        async () => {
            if (!usePlan.modal.create) {
                usePlan.modal.edit = false;
                usePlan.clearData();
            }
        }
    );

    onBeforeMount(() => {
        usePlan.getPlans();
    });
</script>
