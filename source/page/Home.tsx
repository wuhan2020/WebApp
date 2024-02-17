import { FC } from 'web-cell';
import { Card, CardBody, CardTitle, Jumbotron, Icon } from 'boot-cell';
import { PageProps } from 'cell-router';

import menu from './data/menu';

export const HomePage: FC<PageProps> = props => (
    <main {...props}>
        <Jumbotron
            className="my-5 p-5"
            title="新冠战疫信息平台"
            description="新冠病毒疫情中的武汉援助信息网站"
        />
        <ul className="row list-unstyled g-3">
            {menu.slice(1, -1).map(({ title, href, icon }) => (
                <li key={title} className="col-sm-6 col-md-6 col-lg-4">
                    <Card>
                        <CardBody className="d-flex flex-column align-items-center gap-3">
                            <Icon name={icon} size={5} color="primary" />

                            <CardTitle className="m-0">
                                <a
                                    className="text-decoration-none stretched-link"
                                    href={
                                        href.startsWith('http')
                                            ? href
                                            : `#${href}`
                                    }
                                >
                                    {title}
                                </a>
                            </CardTitle>
                        </CardBody>
                    </Card>
                </li>
            ))}
        </ul>
    </main>
);
