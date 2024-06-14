import IconMenuInvoice from '@/components/icon/icon-notes.vue';
import IconMenuNotes from '@/components/icon/menu/icon-menu-notes.vue';
import IconUsers from '@/components/icon/menu/icon-menu-users.vue';
import IconStaff from '@/components/icon/icon-archive.vue';
import IconChecklist from '@/components/icon/icon-file.vue';
import IconRole from '@/components/icon/icon-user-plus.vue';
import IconUser from '@/components/icon/icon-user.vue';
import IconPlan from '@/components/icon/icon-dollar-sign-circle.vue';
import IconGroup from '@/components/icon/icon-users.vue';
// import IconSettings from '@/components/icon/icon-settings.vue';

export const sidebar = [
    {
        id: 1,
        name: 'Course',
        title: 'Kurslar',
        url: '/courses',
        svg: IconMenuInvoice,
        role: false,
    },
    {
        id: 1,
        name: 'Group',
        title: 'Guruhlar',
        url: '/group',
        svg: IconGroup,
        role: false,
    },
    {
        id: 1,
        name: 'Student',
        title: 'Talabalar',
        url: '/students',
        svg: IconUsers,
        role: false,
    },
    {
        id: 1,
        name: 'Employee',
        title: 'Xodimlar',
        url: '/staff',
        svg: IconStaff,
        role: false,
    },
    {
        id: 1,
        name: 'Role',
        title: 'Rollar',
        url: '/roles',
        svg: IconRole,
        role: false,
    },
    // {
    //     id: 1,
    //     name: 'User',
    //     title: 'Foydalanuvchilar',
    //     url: '/users',
    //     svg: IconUser,
    //     role: false,
    // },
    // {
    //     id: 1,
    //     name: 'Plan',
    //     title: 'Tarif',
    //     url: '/plan',
    //     svg: IconPlan,
    //     role: false,
    // },
    // {
    //     id: 1,
    //     name: 'Settings',
    //     title: 'Sozlamalar',
    //     url: '/settings',
    //     svg: IconSettings,
    //     role: false,
    // },
];
