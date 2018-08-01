export class Audience {
	areasOfWork: string[]
	departments: string[]
	grades: string[]
	interests: string[]
	mandatory: boolean

	requiredBy?: Date | null
	frequency?: string | null
}
