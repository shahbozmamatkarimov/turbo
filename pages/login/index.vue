<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
        </div>
        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
        >
            <img src="/assets/images/auth/coming-soon-object1.png" alt="image" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
            <img src="/assets/images/auth/coming-soon-object2.png" alt="image" class="absolute left-24 top-0 h-40 md:left-[30%]" />
            <img src="/assets/images/auth/coming-soon-object3.png" alt="image" class="absolute right-0 top-0 h-[300px]" />
            <img src="/assets/images/auth/polygon-object.svg" alt="image" class="absolute bottom-0 end-[28%]" />
            <div
                class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0"
            >
                <div
                    class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"
                >
                    <div
                        class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent xl:w-16 ltr:-right-10 ltr:bg-gradient-to-r ltr:xl:-right-20 rtl:-left-10 rtl:bg-gradient-to-l rtl:xl:-left-20"
                    ></div>
                    <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                        <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                            <img class="inline w-40 ltr:-ml-1 rtl:-mr-1" src="/kolingo_login.svg" alt="" />
                        </NuxtLink>
                        <div class="mt-24 hidden w-full max-w-[430px] lg:block">
                            <img src="/assets/images/auth/login.svg" alt="Cover Image" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div class="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <NuxtLink to="/" class="block w-8 lg:hidden">
                            <img src="/assets/images/logo.svg" alt="Logo" class="mx-auto w-10" />
                        </NuxtLink>
                    </div>
                    <div class="w-full max-w-[440px] lg:mt-16">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Kirish</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Kirish uchun telefon raqam va parolingizni kiriting</p>
                        </div>
                        <form class="space-y-5 dark:text-white" @submit.prevent="useAuth.authLogin">
                            <div>
                                <label for="Phone">Telefon</label>
                                <div class="relative text-white-dark">
                                    <input
                                        v-model="useAuth.login.phone"
                                        @input="phoneMask"
                                        id="Phone"
                                        type="tel"
                                        placeholder="Telefon raqamni kiriting"
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        required
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-phone-call :fill="true" />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label for="Password">Parol</label>
                                <div class="relative text-white-dark">
                                    <input
                                        v-model="useAuth.login.password"
                                        id="Password"
                                        type="password"
                                        placeholder="Parolni kiriting"
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        required
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                Kirish
                            </button>
                        </form>
                    </div>
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}.TURBO .</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { computed } from 'vue';
    import appSetting from '@/app-setting';
    import { useRouter } from 'vue-router';
    import { useAuthStore, useAppStore, useLoadingStore } from '@/stores';
    useHead({ title: 'Kirish' });
    const router = useRouter();
    definePageMeta({
        layout: 'auth-layout',
    });
    const isLoading = useLoadingStore();
    const store = useAppStore();
    const { setLocale } = useI18n();
    const useAuth = useAuthStore();

    // multi language
    const changeLanguage = (item) => {
        appSetting.toggleLanguage(item, setLocale);
    };
    const currentFlag = computed(() => {
        return `/assets/images/flags/${store.locale?.toUpperCase()}.svg`;
    });

    function phoneMask() {
        useAuth.login.phone = isLoading.phoneMask(useAuth.login.phone);
    }
</script>
