import { attribute, component, observer } from 'web-cell';
import { Image, SpinnerBox } from 'boot-cell';
import { GithubRepository } from 'github-web-widget';
import { observable } from 'mobx';

import { Contributor, repository } from '../../service';

@component({ tagName: 'community-page' })
@observer
export class CommunityPage extends HTMLElement {
    @attribute
    @observable
    accessor loading = false;

    @observable
    accessor list: Contributor[] = [];

    async mountedCallback() {
        this.loading = true;

        this.list = await repository.getContributors();

        this.loading = false;
    }

    render() {
        const { loading, list } = this;

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
                    {list.map(({ html_url, avatar_url, login }) => (
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
