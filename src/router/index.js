import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login/Login.vue';
import DashBoard from '../views/DashBoard/DashBoard.vue';
import Notice from '../views/System/Notice.vue';
import Manage from '../views/Account/Manage.vue';
import Department from '../views/System/Department.vue';
import SalaryList from '../views/Personnel/Salary-list.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/vue',
        name: 'vue',
        component: DashBoard,
        children: [
            {
                path: 'system',
                name: 'system',
                children: [
                    {
                        path: 'notice',
                        name: 'notice',
                        component: Notice,
                    },
                    {
                        path: 'department',
                        name: 'department',
                        component: Department,
                    },
                ],
            },
            {
                path: 'personnel',
                name: 'personnel',
                children: [
                    {
                        path: 'salary-list',
                        name: 'salary-list',
                        component: SalaryList,
                    },
                ],
            },
            {
                path: 'account',
                name: 'account',
                children: [
                    {
                        path: 'manage',
                        name: 'manage',
                        component: Manage,
                    },
                ],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

export default router;
