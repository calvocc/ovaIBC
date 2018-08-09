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
		if (this.props.usuario){
			db.onGetUsers(this.props.usuario.uid).then(snapshot =>
				this.setState(() => ({ 
					Nombre: snapshot.val().Nombre,
					Apellidos: snapshot.val().Apellidos,
					Rol: snapshot.val().Rol,
					Email: snapshot.val().Email,
				}))
			);
		}
	}

	render() {
		return (
			<div className="navegacion-top">
				<Navbar expand="md" >
					<NavbarBrand tag={Link} to={routes.LANDING}>IVC</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							{ this.state.Rol >=3 &&
								<UncontrolledDropdown nav inNavbar>
									<DropdownToggle nav caret>
										Locaciones
									</DropdownToggle>
									<DropdownMenu right>
										<DropdownItem tag={Link} to={routes.PAISES}>
											Paises
										</DropdownItem>
										<DropdownItem tag={Link} to={routes.CIUDADES}>
											Ciudades
										</DropdownItem>
										<DropdownItem tag={Link} to={routes.IGLESIAS}>
											Iglesias
										</DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>
							}
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
									{this.state.Email}
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
