import {CancellationPolicy} from '../cancellationPolicy'
import {Factory} from './factory'

export class CancellationPolicyFactory implements Factory<CancellationPolicy> {
	create(data: any) {
		const cancellationPolicy: CancellationPolicy = new CancellationPolicy()

		cancellationPolicy.id = data.id
		cancellationPolicy.name = data.name
		cancellationPolicy.shortVersion = data.shortVersion
		cancellationPolicy.fullVersion = data.fullVersion

		return cancellationPolicy
	}
}
