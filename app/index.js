// require app styles
import './sass/main.scss';

import { ModalService } from './modal';


let modalService = new ModalService();

modalService.open(
		{
			template: `<div>this is the template</div>`,
			size: 'large',
			display: 'center'
		});