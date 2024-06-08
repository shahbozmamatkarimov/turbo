<template>
    <section
        v-if="isLoading.store.userData.type == 'Super Admin'"
        v-loading="isLoading.isLoadingType('getSettings')"
        class="panel w-full space-y-5 overflow-hidden overflow-y-auto text-sm md:text-[16px]"
    >
        <h1 class="_c00 text-xl font-semibold">App sozlamalar</h1>
        <div>
            <p class="my-5">App versiya</p>
            <div class="flex h-10 items-center gap-3">
                <p class="full_flex h-10 rounded-md border px-6">{{ useSettings.store.settings.app_version?.value }}</p>
                <button
                    @click="handleUpdate(useSettings.store.settings.app_version, 'app_version')"
                    class="h-10 rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase"
                >
                    Tahrirlash
                </button>
            </div>
        </div>
        <div>
            <p class="mb-2">Telegram token</p>
            <div class="flex gap-3">
                <p class="border_ce0 flex h-10 w-full items-center truncate rounded-[4px] border px-3 text-sm font-medium">
                    <span class="truncate">{{ useSettings.store.settings.telegram_token?.value }}</span>
                </p>
                <button
                    @click="handleUpdate(useSettings.store.settings.telegram_token, 'telegram_token')"
                    class="rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase"
                >
                    Tahrirlash
                </button>
            </div>
        </div>
        <div>
            <p class="mb-2">Ma'lumotlar</p>
            <div class="flex gap-3">
                <p class="border_ce0 flex h-10 w-full items-center truncate rounded-[4px] border px-3 text-sm font-medium">
                    <span class="truncate" v-html="useSettings.store.settings.info?.value"></span>
                </p>
                <button @click="handleUpdate(useSettings.store.settings.info, 'info')" class="rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase">
                    Tahrirlash
                </button>
            </div>
        </div>
        <div>
            <p class="mb-2">Kontakt link</p>
            <div class="flex gap-3">
                <p class="border_ce0 flex h-10 w-full items-center truncate rounded-[4px] border px-3 text-sm font-medium">
                    <span class="truncate">{{ useSettings.store.settings.contact_link?.value }}</span>
                </p>
                <button
                    @click="handleUpdate(useSettings.store.settings.contact_link, 'contact_link')"
                    class="rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase"
                >
                    Tahrirlash
                </button>
            </div>
        </div>
        <div>
            <p class="mb-2">Telefon raqam</p>
            <div class="flex gap-3">
                <p class="border_ce0 flex h-10 w-full items-center truncate rounded-[4px] border px-3 text-sm font-medium">
                    <span class="truncate">{{ useSettings.store.settings.contact_number?.value }}</span>
                </p>
                <button
                    @click="handleUpdate(useSettings.store.settings.contact_number, 'contact_number')"
                    class="rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase"
                >
                    Tahrirlash
                </button>
            </div>
        </div>
        <div>
            <p class="mb-2">Lug'at versiyasi</p>
            <div class="flex gap-3">
                <p class="border_ce0 flex h-10 w-full items-center truncate rounded-[4px] border px-3 text-sm font-medium">
                    <span class="truncate">{{ useSettings.store.settings.words_version?.value }}</span>
                </p>
                <!-- <button
                    @click="handleUpdate(useSettings.store.settings.contact_link, 'contact_link')"
                    class="rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase"
                >
                    Tahrirlash
                </button> -->
            </div>
        </div>
        <div>
            <p class="mb-2">Iboralar versiyasi</p>
            <div class="flex gap-3">
                <p class="border_ce0 flex h-10 w-full items-center truncate rounded-[4px] border px-3 text-sm font-medium">
                    <span class="truncate">{{ useSettings.store.settings.phrases_version?.value }}</span>
                </p>
                <!-- <button
                    @click="handleUpdate(useSettings.store.settings.contact_link, 'contact_link')"
                    class="rounded-md bg-[#BCDEFF] px-6 font-semibold uppercase"
                >
                    Tahrirlash
                </button> -->
            </div>
        </div>
    </section>

    <!-- Modal -->
    <client-only>
        <TransitionRoot appear :show="useSettings.modal.edit" as="template">
            <Dialog as="div" @close="useSettings.modal.edit = false" class="relative z-[51]">
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
                    <form @submit.prevent="useSettings.updateSettings" class="flex min-h-full items-center justify-center px-4 py-8">
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
                                    @click="useSettings.modal.edit = false"
                                >
                                    <icon-x />
                                </button>
                                <div class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5">
                                    Tahrirlash
                                </div>
                                <div class="p-5">
                                    <div data-upload-id="myFirstImage">
                                        <quillEditor
                                            v-if="useSettings.store.name == 'info'"
                                            ref="editor"
                                            v-model:value="useSettings.store.data"
                                            :options="options1"
                                            style="min-height: 100px"
                                        ></quillEditor>
                                        <input v-else v-model="useSettings.store.data" type="text" placeholder="Enter" class="form-input mb-4" />
                                    </div>

                                    <div class="mt-8 flex items-center justify-end">
                                        <button type="button" @click="useSettings.modal.edit = false" class="btn btn-outline-danger">Bekor qilish</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            <p>Saqlash</p>
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </form>
                </div>
            </Dialog>
        </TransitionRoot>
    </client-only>
</template>

<script setup>
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
    import 'vue3-quill/lib/vue3-quill.css';
    import { useSettingsStore, useLoadingStore } from '@/stores';

    const useSettings = useSettingsStore();
    const isLoading = useLoadingStore();
    useHead({ title: 'Sozlamalar' });

    const options1 = ref({
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        placeholder: '',
    });

    if(!isLoading.store.userData.type == 'Super Admin') {
        router.push("/");
    }

    function handleUpdate(data, name) {
        useSettings.store.id = data?.id;
        useSettings.store.data = data?.value;
        useSettings.store.name = name;
        useSettings.modal.edit = true;
    }

    onBeforeMount(() => {
        useSettings.getSettings();
    });
</script>

<style lang="scss">
    .border_ce0 {
        border: 1px solid #e0e0e0;
    }

    .full_flex {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
