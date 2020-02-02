export enum RouteRoot {
    Hospital = 'hospital',
    Logistics = 'logistics',
    Hotel = 'hotel',
    Factory = 'factory',
    Donation = 'donation',
    Clinic = 'clinic',
    Maps = 'maps'
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
        href: RouteRoot.Hotel,
        icon: 'hotel'
    },
    {
        title: '生产',
        href: RouteRoot.Factory,
        icon: 'medkit'
    },
    {
        title: '捐赠',
        href: RouteRoot.Donation,
        icon: 'heart'
    },
    {
        title: '义诊',
        href: RouteRoot.Clinic,
        icon: 'user-md'
    },
    {
        title: '疫情地图',
        href: RouteRoot.Maps,
        icon: 'map'
    },
    {
        title: '开放源代码',
        href: 'https://github.com/wuhan2020/WebApp'
    }
];
