import { FC } from 'web-cell';
import { createRouter } from 'cell-router';
import {
    Container,
    OffcanvasNavbar,
    NavLink,
    DropdownItem,
    DropdownButton
} from 'boot-cell';

import { session } from '../model';
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

// const routes = [
//         { paths: [RouteRoot.Hospital + '/edit'], component: HospitalEdit },
//         { paths: [RouteRoot.Hotel + '/edit'], component: HotelEdit },
//         { paths: [RouteRoot.Factory + '/edit'], component: FactoryEdit },
//         {
//             paths: [RouteRoot.Maps],
//             component: async () => (await import('./Map')).MapsPage
//         },
//         {
//             paths: [RouteRoot.Admin, RouteRoot.Admin + '/user'],
//             component: UserAdmin
//         }
//     ],
const userMenu = [
    {
        title: '管理',
        href: 'admin',
        roles: ['Admin'] as RoleNames[]
    },
    {
        title: '登出',
        onClick: () => session.signOut()
    }
];

const { location } = globalThis,
    { Route } = createRouter();

export const PageFrame: FC = () => (
    <div className="d-flex flex-column" style={{ height: '200vh' }}>
        <OffcanvasNavbar
            variant="light"
            expand="md"
            sticky="top"
            brand={
                <img
                    alt="新冠战疫信息平台"
                    src={logo}
                    style={{ height: '2rem' }}
                />
            }
        >
            {menu.map(({ href, title }) => (
                <NavLink
                    className="m-3 my-md-0 mx-md-3"
                    href={href.startsWith('http') ? href : `#${href}`}
                    active={
                        location.hash.slice(1) === href ||
                        (!!href && location.hash.slice(1).startsWith(href))
                    }
                >
                    {title}
                </NavLink>
            ))}
            {session.user && (
                <DropdownButton
                    variant="primary"
                    // alignType="right"
                    // alignSize="md"
                    caption={session.user.username}
                >
                    {userMenu.map(
                        ({ roles, title, ...rest }) =>
                            !roles ||
                            (roles?.find(role => session.hasRole(role)) && (
                                <DropdownItem {...rest}>{title}</DropdownItem>
                            ))
                    )}
                </DropdownButton>
            )}
        </OffcanvasNavbar>

        <Container className="flex-fill overflow-auto scrollbar-none">
            <Route path="" component={HomePage} />
            <Route path={RouteRoot.Hospital} component={HospitalPage} />
            <Route path={RouteRoot.Logistics} component={LogisticsPage} />
            <Route
                path={RouteRoot.Logistics + '/edit'}
                component={LogisticsEdit}
            />
            <Route path={RouteRoot.Hotel} component={HotelPage} />
            <Route path={RouteRoot.Factory} component={FactoryPage} />
            <Route path={RouteRoot.Donation} component={DonationPage} />
            <Route
                path={RouteRoot.Donation + '/edit'}
                component={DonationEdit}
            />
            <Route path={RouteRoot.Clinic} component={ClinicList} />
            <Route path={RouteRoot.Clinic + '/edit'} component={ClinicEdit} />
            <Route path={RouteRoot.Community} component={CommunityPage} />
            <Route
                path="disclaimer"
                component={({ className = '', ...props }) => (
                    <article
                        className={`py-5 ${className}`}
                        {...props}
                        innerHTML={Disclaimer}
                    />
                )}
            />
        </Container>

        <footer className="d-md-flex justify-content-around text-center bg-light py-5">
            <p>
                Proudly developed with
                <a
                    className="mx-1"
                    target="_blank"
                    href="https://web-cell.dev/"
                >
                    WebCell v3
                </a>
                &amp;
                <a
                    className="mx-1"
                    target="_blank"
                    href="https://web-cell.dev/BootCell/"
                >
                    BootCell v2
                </a>
            </p>
            <a href="#disclaimer">免责声明</a>
        </footer>
    </div>
);
