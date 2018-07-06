import {HomeController} from "./controllers/home"

export class ApplicationContext{
	public homeController: HomeController

	constructor(){
		this.homeController = new HomeController()
	}
}

export default new ApplicationContext()