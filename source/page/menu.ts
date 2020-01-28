export enum RouteRoot {
    Hospital = 'hospital',
    Logistics = 'logistics',
    Donation = 'donation'
}

export default [
    {
        title: '首页',
        href: ''
    },
    {
        title: '医院',
        href: RouteRoot.Hospital,
        icon: 'hospital'
    },
    {
        title: '物流',
        href: RouteRoot.Logistics,
        icon: 'shipping-fast'
    },
    {
        title: '酒店',
        href: 'hotel',
        icon: 'hotel'
    },
    {
        title: '生产',
        href: 'factory',
        icon: 'medkit'
    },
    {
        title: '捐赠',
        href: RouteRoot.Donation,
        icon: 'heart'
    },
    {
        title: '义诊',
        href: 'clinic',
        icon: 'user-md'
    },
    {
        title: '开放源代码',
        href: 'https://github.com/wuhan2020/wuhan2020.github.io'
    }
];
