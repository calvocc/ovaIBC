import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { PasswordForgetLink } from './PasswordForget';
import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';


const SignInPage = ({ history }) => <SignInForm history={history} />

const byPropKey = (propertyName, value) => () => ({
	[propertyName]: value,
});

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
	windowHeight: 0,
	windowWidth: 0
};

class SignInForm extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			...INITIAL_STATE
		};
	}

	componentDidMount() {
		this.handleResize();
		window.addEventListener('resize', this.handleResize)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
	}

	handleResize = () => this.setState({
		windowHeight: window.innerHeight,
		windowWidth: window.innerWidth
	});

	onSubmit = (event) => {
		const {
			email,
			password,
		} = this.state;

		const {
			history,
		} = this.props;

		auth.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState(() => ({ ...INITIAL_STATE }));
				history.push(routes.INICIO);
			})
			.catch(error => {
				this.setState(byPropKey('error', error));
			});

		event.preventDefault();
	}

	render() {
		const {
			email,
			password,
			error,
		} = this.state;

		const isInvalid = password === '' || email === '';

		return (
			<Container>
				<Row className="justify-content-center align-items-center" style={{ minHeight: this.state.windowHeight - 70 }}>
					<Col xs="12" sm="8" md="8" lg="5" style={{ marginTop: -30, }}>
						<div className="caja caja-avatar">
							<div className="caja-body">
								<div className="titulo-flex">
									<div className="espacios"></div>
									<div className="modal-header">
										<h5 className="modal-title">Ingreso Seguro</h5>
									</div>
									<div className="espacios"></div>
								</div>
								<p className="text-center">Ingrese su datos para entrar al sistema.</p >
								<Form onSubmit={this.onSubmit}>
									<FormGroup>
										<Label className="label" for="inputEmail">Email</Label>
										<Input 
											value={email}
											onChange={event => this.setState(byPropKey('email', event.target.value))}
											type="email" 
											name="email"
											id="inputEmail" />
									</FormGroup>
									<FormGroup>
										<Label className="label" for="inputPass">Contraseña</Label>
										<Input
											value={password}
											onChange={event => this.setState(byPropKey('password', event.target.value))}
											type="password"
											name="password"
											id="inputPass" />
										<PasswordForgetLink />
									</FormGroup>


									<Button size="md" color="secondary" block disabled={isInvalid} type="submit">Ingresar</Button>

									{ error && <p>{error.message}</p> }
								</Form>
								<SignUpLink/>
							</div>

							
						</div>

					</Col>
				</Row>
			</Container>
						
		);
	}
}

export default withRouter(SignInPage);

export {
	SignInForm,
};