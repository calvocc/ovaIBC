import React from 'react';
import {
BrowserRouter as Router,
Route,
} from 'react-router-dom';
import {Link} from 'react-router-dom';

import Navigation from './Navigation';
import LandingPage from '../screens/Landing';
import SignUpPage from '../screens/SignUp';
import SignInPage from '../screens/SignIn';
import PasswordForgetPage from '../screens/PasswordForget';
import HomePage from '../screens/Home';
import AccountPage from '../screens/Account';
import PisesPage from '../screens/Paises';
import CiudadesPage from '../screens/Ciudades';
import IglesiasPage from '../screens/Iglesias';

import * as routes from '../constants/routes';
import withAuthentication from './withAuthentication';

const App = () =>
	<Router>
		<div className="ova-web">
			<Navigation />
			<Route
				exact path={routes.LANDING}
				component={() => <LandingPage />}
			/>
			<Route
				exact path={routes.REGISTRATE}
				component={() => <SignUpPage />}
			/>
			<Route
				exact path={routes.LOGIN}
				component={() => <SignInPage />}
			/>
			<Route
				exact path={routes.OLVIDAR_CONTRASENA}
				component={() => <PasswordForgetPage />}
			/>
			<Route
				exact path={routes.INICIO}
				component={() => <HomePage />}
			/>
			<Route
				exact path={routes.PERFIL}
				component={() => <AccountPage />}
			/>
			<Route
				exact path={routes.PAISES}
				component={() => <PisesPage/>}
			/>
			<Route
				exact path={routes.CIUDADES}
				component={() => <CiudadesPage/>}
			/>
			<Route
				exact path={routes.IGLESIAS}
				component={() => <IglesiasPage/>}
			/>
			<div className="footer">
				<p className="copy">Power by {' '} <Link className="enlace" to={routes.INICIO}>Asilo de Ideas</Link></p>
			</div>
		</div>
	</Router>

export default withAuthentication(App);