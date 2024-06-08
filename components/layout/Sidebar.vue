<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav class="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
            <div class="h-full bg-white dark:bg-[#0e1726]">
                <div class="flex items-center justify-between px-4 py-3">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                        <img class="ml-[5px] max-h-[40px] max-w-[200px] flex-none" src="/assets/images/logo.svg" alt="" />
                        <!-- <span class="align-middle text-2xl font-semibold dark:text-white-light lg:inline ltr:ml-1.5 rtl:mr-1.5">UNIKOREA</span> -->
                    </NuxtLink>
                    <a
                        href="javascript:;"
                        class="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                        @click="store.toggleSidebar()"
                    >
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>
                <client-only>
                    <perfect-scrollbar
                        :options="{
                            swipeEasing: true,
                            wheelPropagation: false,
                        }"
                        class="relative h-[calc(100vh-80px)]"
                        v-loading="isLoading.isLoadingType('getUser')"
                    >
                        <ul class="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li class="nav-item" v-if="!isLoading.isLoadingType('getUser')">
                                <div v-for="i in sidebar">
                                    <ul>
                                        <li v-if="i.type == 'accordion'" class="menu nav-item">
                                            <button
                                                type="button"
                                                class="nav-link group w-full"
                                                :class="{ active: activeDropdown === i.title }"
                                                @click="activeDropdown === i.title ? (activeDropdown = null) : (activeDropdown = i.title)"
                                            >
                                                <div class="flex items-center">
                                                    <icon-menu-invoice class="shrink-0 group-hover:!text-primary" />

                                                    <span class="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{{
                                                        i.title
                                                    }}</span>
                                                </div>
                                                <div :class="{ '-rotate-90 rtl:rotate-90': activeDropdown !== i.title }">
                                                    <icon-caret-down />
                                                </div>
                                            </button>
                                            <vue-collapsible :isOpen="activeDropdown === i.title">
                                                <ul class="sub-menu text-gray-500">
                                                    <li v-for="child in i.child">
                                                        <NuxtLink v-if="child.role" :to="child.url" @click="toggleMobileMenu">{{ child.title }}</NuxtLink>
                                                    </li>
                                                </ul>
                                            </vue-collapsible>
                                        </li>
                                        <li v-else v-if="i.role" class="nav-item">
                                            <NuxtLink :to="i.url" class="group" @click="toggleMobileMenu">
                                                <div class="flex items-center">
                                                    <!-- <icon-menu-notes class="shrink-0 group-hover:!text-primary" /> -->
                                                    <component :is="i.svg" :fill="true" class="shrink-0 group-hover:!text-primary" />
                                                    <span class="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{{
                                                        i.title
                                                    }}</span>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                                <NuxtLink v-if="isLoading.store.userData?.type == 'Super Admin'" to="/users" class="group">
                                    <div class="flex items-center">
                                        <icon-user class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Foydalanuvchilar</span>
                                    </div>
                                </NuxtLink>
                                <NuxtLink v-if="isLoading.store.userData?.type == 'Super Admin'" to="/settings" class="group">
                                    <div class="flex items-center">
                                        <icon-settings class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Sozlamalar</span>
                                    </div>
                                </NuxtLink>
                            </li>
                        </ul>
                    </perfect-scrollbar>
                </client-only>
            </div>
        </nav>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { sidebar } from '@/constants/sidebar';

    import { useAppStore, useLoadingStore } from '@/stores/index';
    import VueCollapsible from 'vue-height-collapsible/vue3';
    const store = useAppStore();
    const isLoading = useLoadingStore();
    const activeDropdown = ref('');
    const subActive = ref('');

    onMounted(() => {
        setTimeout(() => {
            const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');

            if (selector) {
                selector.classList.add('active');
                const ul = selector.closest('ul.sub-menu');
                if (ul) {
                    let ele = ul.closest('li.menu').querySelectorAll('.nav-link') || [];

                    if (ele.length) {
                        ele = ele[0];
                        setTimeout(() => {
                            ele.click();
                        });
                    }
                }
            }
        });
    });

    const toggleMobileMenu = () => {
        if (window.innerWidth < 1024) {
            store.toggleSidebar();
        }
    };
</script>
