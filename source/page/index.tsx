import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';

import { history, session } from '../model';
import menu from './menu';

import { HomePage } from './Home';
import { HospitalPage } from './Hospital';
import { HospitalEdit } from './Hospital/Edit';
import { LogisticsPage } from './Logistics';

import './index.css';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export class PageRouter extends HTMLRouter {
    protected history = history;
    protected routes = [
        { paths: [''], component: HomePage },
        { paths: ['hospital'], component: HospitalPage },
        { paths: ['hospital/edit'], component: HospitalEdit },
        { paths: ['logistics'], component: LogisticsPage }
    ];

    async signOut() {
        await session.signOut();

        location.href = '.';
    }

    render() {
        return (
            <div className="wrapper">
                <NavBar
                    title="2020 援助武汉"
                    menu={menu.map(({ title, href }) => ({
                        title,
                        href,
                        active:
                            history.path === href ||
                            (!!href && history.path.startsWith(href))
                    }))}
                    narrow
                >
                    {session.user && (
                        <DropMenu
                            title={session.user.username}
                            alignType="right"
                            alignSize="md"
                            list={[
                                {
                                    title: '登出',
                                    href: '#',
                                    onClick: this.signOut
                                }
                            ]}
                        />
                    )}
                </NavBar>

                <main
                    className="main-container container my-5 pt-3"
                    style={{ minHeight: '60vh' }}
                >
                    {super.render()}
                </main>

                <footer className="text-center bg-light py-5">
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
                </footer>
            </div>
        );
    }
}
