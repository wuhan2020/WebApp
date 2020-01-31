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
        title: '首页',
        href: ''
    },
    {
        title: '医院急需物资',
        href: RouteRoot.Hospital,
        icon: 'hospital'
    },
    {
        title: '物流公司',
        href: RouteRoot.Logistics,
        icon: 'shipping-fast'
    },
    {
        title: '医护人员免费住宿信息',
        href: RouteRoot.Hotel,
        icon: 'hotel'
    },
    // {
    //     title: '生产',
    //     href: 'factory',
    //     icon: 'medkit'
    // },
    {
        title: '捐赠信息汇总',
        href: 'donation',
        icon: 'heart'
    },
    // {
    //     title: '义诊',
    //     href: 'clinic',
    //     icon: 'user-md'
    // },
    {
        title: '开放源代码',
        href: 'https://github.com/wuhan2020/wuhan2020.github.io'
    }
];
