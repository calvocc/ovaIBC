import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';


import * as routes from '../constants/routes';
import styles from '../utils/stylos.css'


class NavigationNotLoget extends React.Component {
	state = {
	};

	render() {

		return (
			<div className="navegacion-top">
				<Navbar expand="md" >
					<NavbarBrand tag={Link} to={routes.LANDING}>IBC</NavbarBrand>
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
