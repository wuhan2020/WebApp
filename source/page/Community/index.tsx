import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { GithubRepository } from 'github-web-widget/source/Repository';
import { Octokit } from '@octokit/rest';

import { repository } from '../../service';

interface CommunityPageState {
    loading?: boolean;
    list?: Octokit.ReposListContributorsResponse;
}

@component({
    tagName: 'community-page',
    renderTarget: 'children'
})
export class CommunityPage extends mixin<{}, CommunityPageState>() {
    state = {
        loading: false,
        list: []
    };

    async connectedCallback() {
        this.setState({ loading: true });

        this.setState({
            list: await repository.getContributors(),
            loading: false
        });
    }

    render(_, { loading, list }: CommunityPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>开放社区</h2>

                <h3 className="text-center m-3">开源代码</h3>

                <GithubRepository
                    className="d-block m-auto"
                    style={{ maxWidth: '28rem' }}
                    owner="wuhan2020"
                    repository="WebApp"
                />
                <h3 className="text-center m-3">开发志愿者</h3>

                <ol className="list-inline text-center">
                    {list.map(({ html_url, avatar_url, login }) => (
                        <li className="list-inline-item m-3">
                            <a
                                className="d-flex flex-column align-items-center"
                                target="_blank"
                                href={html_url}
                            >
                                <img
                                    className="img-thumbnail"
                                    style={{
                                        width: '100px',
                                        height: '100px'
                                    }}
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
