import Octokit from '@octokit/rest';
import { Base64 } from 'js-base64';
import { parse } from 'yaml';

interface GitHubOptions {
    owner: string;
    repo: string;
}

export class GitHubModel {
    client = new Octokit();
    options: GitHubOptions;

    constructor(options: GitHubOptions) {
        this.options = options;
    }

    async getContents(path: string) {
        const type = path.split('.').slice(-1)[0],
            { data } = await this.client.repos.getContents({
                ...this.options,
                path
            });
        // @ts-ignore
        const raw = Base64.decode(data.content);

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
}
