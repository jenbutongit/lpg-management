import {Request, Response} from 'express'

export class HomeController {

	public index() {
		console.log("In index controller")
		return (request: Request, response: Response) => {
			response.render("index")
		}
	}
}