import React from 'react';
import { Link } from 'react-router-dom';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';


import * as routes from '../constants/routes';


class NavigationNotLoget extends React.Component {
	state = {
	};

	render() {

		return (
			<div className="navegacion-top">
				<Navbar expand="md" >
					<NavbarBrand tag={Link} to={routes.LANDING}>IVC</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink tag={Link} to={routes.LOGIN}>Ingresar</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}


export default NavigationNotLoget;
