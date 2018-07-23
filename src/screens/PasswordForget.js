import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import {auth} from '../firebase';
import styles from '../utils/stylos.css'
import logo from '../utils/img/LogoSimbolo-drapp.png'

const PasswordForgetPage = () => <PasswordForgetForm />

const byPropKey = (propertyName, value) => () => ({
  	[propertyName]: value,
});

const INITIAL_STATE = {
	email: '',
	error: null,
	windowHeight: undefined,
	windowWidth: undefined
};

class PasswordForgetForm extends Component {
	constructor(props) {
		super(props);

		this.state = { 
		...INITIAL_STATE };
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
		const { email } = this.state;

		auth.doPasswordReset(email)
		.then(() => {
			this.setState(() => ({ ...INITIAL_STATE }));
		})
		.catch(error => {
			this.setState(byPropKey('error', error));
		});

		event.preventDefault();
	}

	render() {
		const {
			email,
			error,
		} = this.state;

		const isInvalid = email === '';

		return (
			<Container>
				<Row className="justify-content-center align-items-center" style={{ minHeight: this.state.windowHeight - 70 }}>
					<Col xs="12" sm="8" md="8" lg="5" style={{marginTop: -30,}}>
						<div className="caja caja-avatar">
							<div className="caja-body">
								<div className="avatar">
									<img src={logo} />
								</div>
								<p>Ingrese su email y le enviaremos un correo a su bandeja de entrada con las instrucciones a seguir.</p>
								<form onSubmit={this.onSubmit}>
									<FormGroup>
										<Label className="label" for="inputEmail">Email</Label>
										<Input
											value={email}
											onChange={event => this.setState(byPropKey('email', event.target.value))}
											type="email"
											name="email"
											id="inputEmail"
											placeholder="Email..." />
									</FormGroup>
									<Button size="md" color="secondary" block disabled={isInvalid} type="submit">Recuperar</Button>

									{ error && <p>{error.message}</p> }
								</form>
							</div>


						</div>

					</Col>
				</Row>
			</Container>
		);
	}
}

const PasswordForgetLink = () =>
  	<Link to="/olvidar-contrasena" className="btn btn-link btn-block text-right btn-sm">Olvidaste tu contraseña</Link>

export default PasswordForgetPage;

export {
	PasswordForgetForm,
	PasswordForgetLink,
};