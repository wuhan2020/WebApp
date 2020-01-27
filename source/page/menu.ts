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
            title: '开放源代码',
            href: Href.OpenSource
        }
    ];
}
