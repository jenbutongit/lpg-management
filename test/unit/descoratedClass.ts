import {describe} from 'mocha'

function f() {
	console.log("f(): evaluated");
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		console.log("f(): called");
	}
}

function g(value1: string, value2: string) {
	console.log("g(): evaluated");
	console.log(`${value1} ${value2}`)
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		console.log("g(): called");
		console.log(`target = ${target}`)
		console.log(target)
		console.log(`propertyKey = ${propertyKey}`)
		console.log(propertyKey)
		console.log(`descriptor = ${descriptor}`)
		console.log(descriptor)
		console.log(target[propertyKey])
	}
}

class C {
	@f()
	@g('Hello','World!')
	doSomething(value1: string) {
		console.log(value1)
	}
}


describe("", () => {
	const c = new C()
	c.doSomething("Hello Again World!")

})

