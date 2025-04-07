import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login/Login.vue';
import DashBoard from '../views/DashBoard/DashBoard.vue';
import Notice from '../views/System/Notice.vue';
import Manage from '../views/Account/Manage.vue';
import Department from '../views/System/Department.vue';
import SalaryList from '../views/Personnel/Salary-list.vue';
import Daily from '../views/Sales/Daily.vue';
import Monthly from '../views/Sales/Monthly.vue';
import Employee from '../views/Employee/Employee.vue';
import ExpenseList from '../views/Account/ExpenseList.vue';
import Plan from '../views/Business/Plan/Plan.vue';

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
                ],
            },
        ],
        children: [
            {
                path: 'business',
                name: 'business',
                children: [
                    {
                        path: 'sales-plan',
                        name: 'sales-plan',
                        component: Plan,
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
