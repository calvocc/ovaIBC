import React from 'react';

import AuthUserContext from './AuthUserContext';
import NavigationNonAuth from './NavigationNotLoget'
import NavigationAuth from './NavigationLoget'


const Navigation = () =>
	<AuthUserContext.Consumer>
		
		{authUser => authUser
			? <NavigationAuth usuario={authUser}/>
			: <NavigationNonAuth />
		}
		
	</AuthUserContext.Consumer>


export default Navigation;