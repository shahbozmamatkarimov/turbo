<template>
    <div class="panel" v-loading="isLoading.isLoadingType('getMemberMembers')">
        <div class="mb-5 flex items-center justify-between">
            <h5 @click="$router.back()"
                class="cursor-pointer flex items-center gap-1 text-lg font-semibold dark:text-white-light">
                <icon-arrow-left class="text-darj rotate-180" />
                Azolar
            </h5>
            <div class="flex items-center justify-center">
                <button type="button" class="btn btn-info" @click="routeToAssign">Topshiriqlar</button>
            </div>
        </div>
        <div v-if="isLoading.store.permissions?.includes('Create Word')" @click="useMember.modal.create = true"
            class="mb-4 grid w-full h-10 cursor-pointer place-content-center rounded-md border border-white-dark/20 dark:border-[#191e3a]">
            <icon-plus class="h-6 w-6" />
        </div>
        <div class="mb-5">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Foydalanuvchi</th>
                            <th>Guruh sardori</th>
                            <th>Sariq kartoshkalar soni</th>
                            <th>Bloklanishlar soni</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(data, index) in useMember.store.member" :key="data.id">
                            <tr>
                                <td class="whitespace-nowrap">#{{ data.id }}</td>
                                <td class="flex items-center gap-2">
                                    <img v-if="data.user?.image" class="h-6 w-6 rounded-full" :src="data.user.image"
                                        alt="" />
                                    <img v-else
                                        class="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                        src="https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744034?k=20&m=1016744034&s=612x612&w=0&h=kjCAwH5GOC3n3YRTHBaLDsLIuF8P3kkAJc9RvfiYWBY="
                                        alt="" />
                                    {{ data.user?.name }}
                                    {{ data.user?.last_name }}
                                </td>
                                <td class="whitespace-nowrap"><icon-checks v-if="data.is_capitan == 1" /> <icon-lock v-else /> </td>
                                <td class="whitespace-nowrap">{{ data.yellow_card_count }}</td>
                                <td class="whitespace-nowrap">{{ data.is_banned }}</td>
                                <td class="text-center">
                                    <ul class="flex items-center justify-center gap-3">
                                        <li @click="handleTahrirlash(data)">
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
                                        <!-- <li v-if="isLoading.store.permissions?.includes('Edit Member')" @click="handleTahrirlash(data)">
                                            <client-only>
                                                <a href="javascript:;" v-tippy:edit>
                                                    <icon-pencil class="text-success" />
                                                </a>
                                            </client-only>
                                        </li>
                                        <li v-if="isLoading.store.permissions?.includes('Delete Member')" @click="handleDelete(data.id)">
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
            v-if="!isLoading.isLoadingType('getMemberMembers') && !useMember.store.member.length">
            Ma'lumotlar yo'q
        </div>
        <!-- <Pagination class="mt-4" /> -->
    </div>

    <!-- Modal -->
    <client-only>
        <!-- create and update -->
        <TransitionRoot appear :show="useMember.modal.create" as="template">
            <Dialog as="div" @close="useMember.modal.create = false" class="relative z-[52]">
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
                                    @click="useMember.modal.create = false">
                                    <icon-x />
                                </button>
                                <div
                                    class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Azoni <span v-if="useMember.modal.edit">tahrirlash</span>
                                    <span v-else>qo'shish</span>
                                </div>
                                <form @submit.prevent="useMember.createMember" class="p-5">
                                    <div v-if="!useMember.modal.edit" class="custom-file-container" data-upload-id="myFirstImage">
                                        <p>Azo nomi</p>
                                        <multiselect v-model="useMember.store.user_id" :options="useUser.store.users"
                                            @input="searchUsers" class="mb-3 custom-multiselect" :searchable="true"
                                            :preselect-first="true" :allow-empty="false" track-by="name" label="name"
                                            selected-label="" select-label="" deselect-label="">
                                        </multiselect>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <input id="group_access" v-model="useMember.create.is_capitan"
                                                type="checkbox" class="h-5 w-5" />
                                            <label for="group_access">Guruh sardori</label> 
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useMember.modal.create = false"
                                            class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p v-if="useMember.modal.edit">Saqlash</p>
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
        <TransitionRoot appear :show="useMember.modal.delete" as="template">
            <Dialog as="div" @close="useMember.modal.delete = false" class="relative z-[51]">
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
                                    @click="useMember.modal.delete = false">
                                    <icon-x />
                                </button>
                                <div
                                    class="bg-[#fbfbfb] py-3 text-lg font-medium dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Azoni o'chirish
                                </div>
                                <div class="p-5 text-center">
                                    <div
                                        class="mx-auto w-fit rounded-full bg-danger p-4 text-white ring-4 ring-danger/30">
                                        <icon-trash-lines class="mx-auto h-7 w-7" />
                                    </div>
                                    <div class="mx-auto mt-5 sm:w-3/4">Haqiqatdan ham o'chirmoqchimisiz?</div>

                                    <div class="mt-8 flex items-center justify-center">
                                        <button type="button" class="btn btn-outline-danger"
                                            @click="useMember.modal.delete = false">Bekor qilish</button>
                                        <button type="button" class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            @click="useMember.deleteMember">O'chirish</button>
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
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
import Multiselect from '@suadelabs/vue3-multiselect';
import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
import { useMemberStore, useLoadingStore, useUserStore } from '@/stores';
useHead({ title: 'Azolar' });
const useMember = useMemberStore();
const useUser = useUserStore();
const router = useRouter();
const isLoading = useLoadingStore();

const minutes_list = [];
for (let i = 1; i <= 60; i++) {
    minutes_list.push(i < 10 ? '0' + i : i);
}

const hours_list = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

isLoading.store.page_name = 'member';

if (!isLoading.store.permissions?.includes('View Member')) {
    // router.push("/");
}

function routeToAssign() {
    const group_id = router.currentRoute.value.params.group_id
    router.push(`/group/assignments/${group_id}`)
}

function phoneMask() {
    useMember.create.phone = isLoading.phoneMask(useMember.create.phone);
}

function handleTahrirlash(data) {
    for (let i in useMember.create) {
        useMember.create[i] = data[i];
    }
    useMember.create.is_capitan = data.is_capitan == 0 ? false : true;
    console.log(data);
    useMember.store.user_id = data.user;
    useMember.store.member_id = data.id;
    useMember.modal.create = true;
    useMember.modal.edit = true;
    console.log(data);
    // useUser.getUserById(data.user.id);
}

function handleDelete(id) {
    useMember.store.member_id = id;
    useMember.modal.delete = true;
}

function searchUsers(e) {
    useUser.getUsers(e.target.value);
}

watch(
    () => useMember.modal.create,
    async () => {
        if (!useMember.modal.create) {
            useMember.modal.edit = false;
            useMember.clearData();
            useUser.getUsers();
        }
    }
);

onBeforeMount(() => {
    useMember.getMember();
    useUser.getUsers();
});
</script>
