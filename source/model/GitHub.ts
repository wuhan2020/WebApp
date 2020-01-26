import Octokit from '@octokit/rest';
import { Base64 } from 'js-base64';

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
        const { data } = await this.client.repos.getContents({
            ...this.options,
            path
        });
        // @ts-ignore
        return Base64.decode(data.content);
    }
}
