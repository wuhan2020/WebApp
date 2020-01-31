export enum RouteRoot {
    Hospital = 'hospital',
    Logistics = 'logistics',
    Hotel = 'hotel',
    Factory = 'factory',
    Donation = 'donation',
    Clinic = 'clinic'
}

export default [
    {
        title: '首 页',
        href: ''
    },
    {
        title: '医 院',
        href: RouteRoot.Hospital,
        icon: 'hospital'
    },
    {
        title: '物 流',
        href: RouteRoot.Logistics,
        icon: 'shipping-fast'
    },
    {
        title: '酒 店',
        href: RouteRoot.Hotel,
        icon: 'hotel'
    },
    {
        title: '生 产',
        href: RouteRoot.Factory,
        icon: 'medkit'
    },
    {
        title: '捐 赠',
        href: RouteRoot.Donation,
        icon: 'heart'
    },
    {
        title: '义 诊',
        href: RouteRoot.Clinic,
        icon: 'user-md'
    },
    {
        title: '开放源代码',
        href: 'https://github.com/wuhan2020/WebApp'
    }
];
