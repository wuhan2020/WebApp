export enum RouteRoot {
    Hospital = 'hospital',
    Logistics = 'logistics',
    Hotel = 'hotel',
    Factory = 'factory',
    Donation = 'donation',
    Clinic = 'clinic',
    Maps = 'maps',
    Admin = 'admin',
    Community = 'community'
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
        icon: 'truck'
    },
    {
        title: '酒店',
        href: RouteRoot.Hotel,
        icon: 'building-check'
    },
    {
        title: '生产',
        href: RouteRoot.Factory,
        icon: 'buildings'
    },
    {
        title: '捐赠',
        href: RouteRoot.Donation,
        icon: 'heart'
    },
    {
        title: '义诊',
        href: RouteRoot.Clinic,
        icon: 'house-heart'
    },
    {
        title: '疫情地图',
        href: RouteRoot.Maps,
        icon: 'map'
    },
    {
        title: '红会监工',
        href: 'https://weileizeng.github.io/red-cross/',
        icon: 'plus-square'
    },
    {
        title: '开放社区',
        href: RouteRoot.Community
    }
];
