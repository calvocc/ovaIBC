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
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import { auth } from '../firebase/firebase';
import { db } from '../firebase';

import * as routes from '../constants/routes';
import SignOutButton from './SignOut'

class MenuAppBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: null,
		};
	}

	componentDidMount() {
		auth.onAuthStateChanged( User => {
			if (User){
				console.log(User.uid)
				db.onGetUsers(User.uid).then(snapshot =>
					this.setState(() => ({ users: snapshot.val().Nombre }))
				);
			}
		})
	}

	render() {
		return (
			<div className="navegacion-top">
				<Navbar expand="md" >
					<NavbarBrand tag={Link} to={routes.LANDING}>IVC</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink tag={Link} to={routes.INICIO}>Cursos</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to={routes.LANDING}>Actividad</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to={routes.INICIO}>Glosario</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to={routes.INICIO}>Foro</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to={routes.INICIO}>Repositorio</NavLink>
							</NavItem>
							<UncontrolledDropdown nav inNavbar>
								<DropdownToggle nav caret>
									{this.state.users}
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem tag={Link} to={routes.INICIO}>
										Option 1
									</DropdownItem>
									<DropdownItem tag={Link} to={routes.INICIO}>
										Option 2
									</DropdownItem>
									<DropdownItem divider />
									<SignOutButton />
								</DropdownMenu>
							</UncontrolledDropdown>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);

	}
}

export default MenuAppBar;
