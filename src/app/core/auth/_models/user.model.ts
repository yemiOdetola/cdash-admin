import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class User extends BaseModel {
    id: number;
    username: string;
    password: string;
    email: string;
    user_token: string;
    refreshToken: string;
    roles: number[];
    pic: string;
    name: string;
    occupation: string;
	companyName: string;
	phone: string;
    address: Address;
    socialNetworks: SocialNetworks;
	organization_id: string;

    clear(): void {
        this.id = undefined;
        this.username = '';
        this.password = '';
        this.email = '';
        this.roles = [];
        this.name = '';
        this.user_token = 'access-token-' + Math.random();
        this.refreshToken = 'access-token-' + Math.random();
        this.pic = './assets/media/users/default.jpg';
        this.occupation = '';
        this.companyName = '';
		this.phone = '';
		this.organization_id = '';
        this.address = new Address();
        this.address.clear();
        this.socialNetworks = new SocialNetworks();
        this.socialNetworks.clear();
    }
}
