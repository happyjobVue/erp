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
import Annual from '../views/Sales/annual.vue';
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
                    {
                        path: 'employee',
                        name: 'employee',
                        component: Employee,
                    },
                ],
            },
            {
                path: 'sales',
                name: 'sales',
                children: [
                    {
                        path: 'daily',
                        name: 'daily',
                        component: Daily,
                    },
                    {
                        path: 'monthly',
                        name: 'monthly',
                        component: Monthly,
                    },
                    {
                        path: 'annual',
                        name: 'annual',
                        component: Annual,
                    },
                ],
            },
            {
                path: 'account',
                name: 'account',
                children: [
                    {
                        path: 'sales-plan',
                        name: 'sales-plan',
                        component: Plan,
                    },
                ],
            },
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
