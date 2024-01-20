import { components } from '@octokit/openapi-types';
import { HTTPClient } from 'koajax';
import { Base64 } from 'js-base64';
import { parse } from 'yaml';

export type PickItem<T> = T extends (infer R)[] ? R : T;

export type Content =
    | PickItem<components['schemas']['content-directory']>
    | PickItem<components['schemas']['content-file']>;

export type Contributor = components['schemas']['contributor'];


export class GitHubClient {
    client = new HTTPClient({
        baseURI: 'https://api.github.com/',
        responseType: 'json'
    });

    constructor(
        public owner: string,
        public repo: string
    ) {}

    async getContents(path: string) {
        const { owner, repo } = this;

        const type = path.split('.').slice(-1)[0],
            { body } = await this.client.get<Content>(
                `repos/${owner}/${repo}/contents/${path}`
            );
        const raw = Base64.decode(body.content);

        switch (type) {
            case 'json':
                return JSON.parse(raw);
            case 'yaml':
            case 'yml':
                return parse(raw);
            default:
                return raw;
        }
    }

    async getContributors() {
        const { owner, repo } = this;

        const { body } = await this.client.get<Contributor[]>(
            `repos/${owner}/${repo}/contributors?per_page=100`
        );
        return body;
    }
}
