import React from 'react';
import {
	DropdownItem
} from 'reactstrap';
import { auth } from '../firebase';

	const SignOutButton = () =>

		<DropdownItem onClick={auth.doSignOut}>Cerrar sesión</DropdownItem>

export default SignOutButton;