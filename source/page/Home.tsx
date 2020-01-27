import { createCell, Fragment } from 'web-cell';
import { Jumbotron } from 'boot-cell/source/Content/Jumbotron';
import { Card } from 'boot-cell/source/Content/Card';

import menu from './menu';

export function HomePage() {
    return (
        <Fragment>
            <Jumbotron
                title="2020 援助武汉"
                description="新冠病毒疫情中的武汉援助信息网站"
            />
            <div className="container card-deck m-auto justify-content-around">
                {menu.slice(1, -1).map(({ title, href, icon }) => (
                    <Card
                        className="mx-auto mt-4 mx-sm-1 text-center"
                        style={{ minWidth: '14rem', maxWidth: '14rem' }}
                        title={title}
                        image={
                            <a href={href}>
                                <i
                                    className={`fa fa-5x fa-${icon} mt-4 mb-2`}
                                />
                            </a>
                        }
                    />
                ))}
            </div>
        </Fragment>
    );
}
