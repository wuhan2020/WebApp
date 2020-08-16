import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';
import marked from 'marked';

import { history, session } from '../model';
import { RoleNames } from '../service';
import menu, { RouteRoot } from './data/menu';
import logo from '../image/wuhan2020.png';

import { HomePage } from './Home';
import { HospitalPage } from './Hospital';
import { HospitalEdit } from './Hospital/Edit';
import { LogisticsPage } from './Logistics';
import { LogisticsEdit } from './Logistics/Edit';
import { HotelPage } from './Hotel';
import { HotelEdit } from './Hotel/Edit';
import { FactoryPage } from './Factory';
import { FactoryEdit } from './Factory/edit';
import { DonationPage } from './Donation/index';
import { DonationEdit } from './Donation/edit';
import { ClinicList } from './Clinic';
import { ClinicEdit } from './Clinic/Edit';
import { UserAdmin } from './Admin/User';
import { CommunityPage } from './Community';
import Disclaimer from '../../Disclaimer.md';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export class PageRouter extends HTMLRouter {
    protected history = history;
    protected routes = [
        { paths: [''], component: HomePage },
        { paths: [RouteRoot.Hospital], component: HospitalPage },
        { paths: [RouteRoot.Hospital + '/edit'], component: HospitalEdit },
        { paths: [RouteRoot.Logistics], component: LogisticsPage },
        { paths: [RouteRoot.Logistics + '/edit'], component: LogisticsEdit },
        { paths: [RouteRoot.Hotel], component: HotelPage },
        { paths: [RouteRoot.Hotel + '/edit'], component: HotelEdit },
        { paths: [RouteRoot.Factory], component: FactoryPage },
        { paths: [RouteRoot.Factory + '/edit'], component: FactoryEdit },
        { paths: [RouteRoot.Donation], component: DonationPage },
        { paths: [RouteRoot.Donation + '/edit'], component: DonationEdit },
        { paths: [RouteRoot.Clinic], component: ClinicList },
        { paths: [RouteRoot.Clinic + '/edit'], component: ClinicEdit },
        {
            paths: [RouteRoot.Maps],
            component: async () => (await import('./Map')).MapsPage
        },
        {
            paths: [RouteRoot.Admin, RouteRoot.Admin + '/user'],
            component: UserAdmin
        },
        { paths: [RouteRoot.Community], component: CommunityPage },
        {
            paths: ['disclaimer'],
            component: () => <div innerHTML={marked(Disclaimer)} />
        }
    ];

    userMenu = [
        {
            title: '管理',
            href: 'admin',
            roles: ['Admin'] as RoleNames[]
        },
        {
            title: '登出',
            onClick: this.signOut
        }
    ];

    connectedCallback() {
        this.classList.add('d-flex', 'flex-column', 'vh-100');

        super.connectedCallback();
    }

    async signOut() {
        await session.signOut();

        location.href = '.';
    }

    render() {
        return (
            <Fragment>
                <NavBar
                    theme="light"
                    background="light"
                    narrow
                    brand={
                        <img
                            alt="新冠战疫信息平台"
                            src={logo}
                            style={{ height: '2rem' }}
                        />
                    }
                    menu={menu.map(({ title, href }) => ({
                        title,
                        href,
                        active:
                            history.path === href ||
                            (!!href && history.path.startsWith(href))
                    }))}
                >
                    {session.user && (
                        <DropMenu
                            caption={session.user.username}
                            alignType="right"
                            alignSize="md"
                        >
                            {this.userMenu.map(({ roles, title, ...rest }) =>
                                !roles ||
                                roles?.find(role => session.hasRole(role)) ? (
                                    <DropMenuItem {...rest}>
                                        {title}
                                    </DropMenuItem>
                                ) : null
                            )}
                        </DropMenu>
                    )}
                </NavBar>

                <main className="flex-grow-1 container my-5 pt-3">
                    {super.render()}
                </main>

                <footer className="d-md-flex justify-content-around text-center bg-light py-5">
                    <p>
                        Proudly developed with
                        <a
                            className="mx-1"
                            target="_blank"
                            href="https://web-cell.dev/"
                        >
                            WebCell v2
                        </a>
                        &amp;
                        <a
                            className="mx-1"
                            target="_blank"
                            href="https://web-cell.dev/BootCell/"
                        >
                            BootCell v1
                        </a>
                    </p>
                    <a href="disclaimer">免责声明</a>
                </footer>
            </Fragment>
        );
    }
}
