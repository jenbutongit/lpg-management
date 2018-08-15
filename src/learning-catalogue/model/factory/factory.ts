export abstract class Factory<T> {
	public abstract create(data: any): T
}
