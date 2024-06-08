<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li class="ltr:before:mr-2 rtl:before:ml-2">
                <span>Profil</span>
            </li>
        </ul>
        <div class="pt-5">
            <div class="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                <div class="panel">
                    <div class="mb-5 flex items-center justify-between">
                        <h5 class="text-lg font-semibold dark:text-white-light">Profil</h5>
                    </div>

                    <div class="mb-5">
                        <div class="flex flex-col items-center justify-center">
                            <img
                                class="h-20 w-20 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                src="https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744034?k=20&m=1016744034&s=612x612&w=0&h=kjCAwH5GOC3n3YRTHBaLDsLIuF8P3kkAJc9RvfiYWBY="
                                alt=""
                            />
                            <p class="flex items-center gap-2 text-xl font-semibold text-primary">
                                {{ useAuth.store.userData.name }} {{ useAuth.store.userData.last_name }}
                                <span @click="useAuth.store.edit_username = true" class="cursor-pointer">
                                    <icon-pencil-paper />
                                </span>
                            </p>
                        </div>
                        <ul class="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                            <li class="flex items-center gap-2">
                                <icon-coffee class="shrink-0" />
                                {{ useAuth.store.userData.type }}
                            </li>
                            <li class="flex items-center gap-2">
                                <icon-calendar class="shrink-0" />
                                {{ formateCreatedAt(useAuth.store.userData.created_at) }}
                            </li>
                            <li class="flex items-center gap-2">
                                <icon-phone />
                                <span class="whitespace-nowrap" dir="ltr">{{ useAuth.store.userData.phone }}</span>
                            </li>
                            <li @click="useAuth.store.edit_password = true" class="flex cursor-pointer items-center gap-2">
                                <div to="/users/user-account-settings" class="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto">
                                    <icon-pencil-paper />
                                </div>
                                <span class="whitespace-nowrap text-primary" dir="ltr">Parolni o'zgartirish</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <client-only>
        <!-- edit username -->
        <TransitionRoot appear :show="useAuth.store.edit_username" as="template">
            <Dialog as="div" @close="useAuth.store.edit_username = false" class="relative z-[52]">
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
                                    @click="useAuth.store.edit_username = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Usernameni o'zgartirish
                                </div>
                                <form @submit.prevent="useAuth.updateUsername" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useAuth.edit_username.name" type="text" placeholder="Ism" class="form-input mb-4" required />
                                        <input v-model="useAuth.edit_username.last_name" type="text" placeholder="Familiya" class="form-input mb-4" required />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useAuth.store.edit_username = false" class="btn btn-outline-danger">
                                            Bekor qilish
                                        </button>
                                        <button type="submit" @click="useAuth.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">Saqlash</button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- edit password -->
        <TransitionRoot appear :show="useAuth.store.edit_password" as="template">
            <Dialog as="div" @close="useAuth.store.edit_password = false" class="relative z-[52]">
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
                                    @click="useAuth.store.edit_password = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Parolni o'zgartirish
                                </div>
                                <form @submit.prevent="useAuth.updatePassword" class="p-5">
                                    <div class="custom-file-container" data-upload-id="myFirstImage">
                                        <input v-model="useAuth.edit_password.current_password" type="text" placeholder="Eski parolingizni kiriting" class="form-input mb-4" required />
                                        <hr class="mb-4" />
                                        <input v-model="useAuth.edit_password.password" type="text" placeholder="Yangi parol kiriting" class="form-input mb-4" required />
                                        <input v-model="useAuth.edit_password.password_confirmation" type="text" placeholder="Parolni qayta kiriting" class="form-input mb-4" required />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useAuth.store.edit_password = false" class="btn btn-outline-danger">
                                            Bekor qilish
                                        </button>
                                        <button type="submit" @click="useAuth.createCourse" class="btn btn-primary ltr:ml-4 rtl:mr-4">Saqlash</button>
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
    import { useAppStore, useLoadingStore, useAuthStore } from '@/stores/index';
    useHead({ title: 'User Profile' });
    const isLoading = useLoadingStore();
    const useAuth = useAuthStore();

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
</script>
