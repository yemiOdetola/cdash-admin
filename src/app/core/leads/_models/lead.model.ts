export class LeadModel {
	_id?: string;
	address: string;
	industry: string;
	title: string;
	name: string;
	status: string;
	source: string;
	country: string;
	company: string;
	phone: string;
	phone2: string;
	website: string;
	description: string;
	image?: any;
	created_at: Date;
	email: string;

	clear() {
		this._id = '';
		this.address = '',
			this.industry = 'Others',
			this.title = '';
		this.name = '';
		this.status = 'Lead Initiated';
		this.source = '';
		this.country = 'NG';
		this.company = '';
		this.phone = '';
		this.phone2 = '';
		this.website = '';
		this.image = '';
		this.description = '';
		this.email = '';
	}
}
