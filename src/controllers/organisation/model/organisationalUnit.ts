export class OrganisationalUnit {
	id: string

	name: string

	code: string

	abbreviation: string

	paymentMethods: string[]

	subOrgs: OrganisationalUnit[]

	parent: OrganisationalUnit
}
