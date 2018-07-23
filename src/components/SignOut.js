import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import { auth } from '../firebase';

	const SignOutButton = () =>
		<MenuItem onClick={auth.doSignOut}>Cerrar sesión</MenuItem>

export default SignOutButton;