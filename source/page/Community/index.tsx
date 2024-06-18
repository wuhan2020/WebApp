import { component, observer } from 'web-cell';
import { Image, SpinnerBox } from 'boot-cell';
import { GithubRepository } from 'github-web-widget';

import { repository } from '../../service';

@component({ tagName: 'community-page' })
@observer
export default class CommunityPage extends HTMLElement {
    mountedCallback() {
        repository.getOne('wuhan2020/WebApp', ['contributors']);
    }

    render() {
        const loading = repository.downloading > 0,
            { contributors } = repository.currentOne;

        return (
            <SpinnerBox className="py-5" cover={loading}>
                <h1>开放社区</h1>

                <h2 className="text-center m-3">开源代码</h2>

                <GithubRepository
                    className="d-block m-auto"
                    style={{ maxWidth: '28rem' }}
                    owner="wuhan2020"
                    repository="WebApp"
                />
                <h2 className="text-center m-3">开发志愿者</h2>

                <ol className="list-inline text-center">
                    {contributors?.map(({ html_url, avatar_url, login }) => (
                        <li className="list-inline-item m-3">
                            <a
                                className="d-flex flex-column align-items-center"
                                target="_blank"
                                href={html_url}
                            >
                                <Image
                                    thumbnail
                                    style={{ width: '100px', height: '100px' }}
                                    src={avatar_url}
                                />
                                {login}
                            </a>
                        </li>
                    ))}
                </ol>
            </SpinnerBox>
        );
    }
}
