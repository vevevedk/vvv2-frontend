/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AccountsService } from './services/AccountsService';
import { ClientsService } from './services/ClientsService';
import { HealthService } from './services/HealthService';
import { JobsService } from './services/JobsService';
import { KeywordsService } from './services/KeywordsService';
import { SearchTermsService } from './services/SearchTermsService';
import { SendGridService } from './services/SendGridService';
import { UsersService } from './services/UsersService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class VeveveApiClient {

    public readonly accounts: AccountsService;
    public readonly clients: ClientsService;
    public readonly health: HealthService;
    public readonly jobs: JobsService;
    public readonly keywords: KeywordsService;
    public readonly searchTerms: SearchTermsService;
    public readonly sendGrid: SendGridService;
    public readonly users: UsersService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.accounts = new AccountsService(this.request);
        this.clients = new ClientsService(this.request);
        this.health = new HealthService(this.request);
        this.jobs = new JobsService(this.request);
        this.keywords = new KeywordsService(this.request);
        this.searchTerms = new SearchTermsService(this.request);
        this.sendGrid = new SendGridService(this.request);
        this.users = new UsersService(this.request);
    }
}
