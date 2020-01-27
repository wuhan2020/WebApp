enum Href {
    Hospital = 'hospital',
    Logistics = 'logistics',
    OpenSource = 'https://github.com/EasyWebApp/wuhan2020'
}

export function getMenu(path?: string) {
    return [
        {
            title: '首页',
            href: ''
        },
        {
            title: '医院',
            href: Href.Hospital,
            icon: 'hospital',
            active: path === Href.Hospital
        },
        {
            title: '物流',
            href: Href.Logistics,
            icon: 'shipping-fast',
            active: path === Href.Logistics
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
            href: 'donation',
            icon: 'heart'
        },
        {
            title: '义诊',
            href: 'clinic',
            icon: 'user-md'
        },
        {
            title: '开放源代码',
            href: Href.OpenSource
        }
    ];
}