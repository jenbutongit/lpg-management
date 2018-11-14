export class OrganisationalUnit {
	id: string

	name: string

	code: string

	paymentMethods: string[]

	subOrgs: OrganisationalUnit[]

	parent: OrganisationalUnit
}
