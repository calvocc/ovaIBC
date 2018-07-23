import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { auth, db } from '../firebase';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import {DatePicker} from 'material-ui-pickers';
import esLocale from 'date-fns/locale/es';
import {format} from "date-fns";

import * as routes from '../constants/routes';
import styles from '../utils/stylos.css'
import logo from '../utils/img/LogoSimbolo-drapp.png'

const SignUpPage = ({ history }) => <SignUpForm history={history} />

const INITIAL_STATE = {
	Nombre: '',
	Apellidos: '',
	Telefono: '',
	Email: '',
	Iglesia: '',
	Cargo: '',
	Nacimiento: new Date(),
	Registro: format(new Date(), 'MM/DD/YYYY'),
	Rol: 0,
	passwordOne: '',
	passwordTwo: '',
	crearIglesia: false,
	error: null,
	windowHeight: 0,
	windowWidth: 0
 };

 const byPropKey = (propertyName, value) => () => ({
	[propertyName]: value,
 });

class SignUpForm extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		this.toggle = this.toggle.bind(this);
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

	handleDateChange = (date) => {
		this.setState({ Nacimiento: format(date, 'MM/DD/YYYY') });
	}

	changeIglesia = (event) =>{
		if (event.target.value === "Otra"){
			this.setState({
				crearIglesia: true,
			})
		} else {
			this.setState({
				Iglesia: event.target.value
			})
		}
	}

	toggle() {
		this.setState({
			crearIglesia: !this.state.crearIglesia
		});
	}

	onSubmit = (event) => {
		const {
			Nombre,
			Apellidos,
			Telefono,
			Email,
			Iglesia,
			Cargo,
			Nacimiento,
			Registro,
			Rol,
			passwordOne,
		} = this.state;

		const {
			history,
		 } = this.props;
	
		auth.doCreateUserWithEmailAndPassword(Email, passwordOne)
			.then(authUser => {
				// Create a user in your own accessible Firebase Database too
				db.doCreateUser(authUser.user.uid, Nombre, Apellidos, Telefono, Email, Iglesia, Cargo, Nacimiento, Registro, Rol)
					.then(() => {
						this.setState(() => ({ ...INITIAL_STATE }));
						history.push(routes.INICIO);
					})
					.catch(error => {
						this.setState(byPropKey('error', error));
					});
			})
			.catch(error => {
				this.setState(byPropKey('error', error));
			});
	
		event.preventDefault();
	}

	render() {
		const {
			Nombre,
			Apellidos,
			Telefono,
			Email,
			Iglesia,
			Cargo,
			Nacimiento,
			passwordOne,
			passwordTwo,
			error,
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			Email === '' ||
			Nombre === '';

		console.log(this.state)

		return (
			<Container>
				<Row className="justify-content-center align-items-center" style={{ minHeight: this.state.windowHeight - 70 }}>
					<Col xs="12" sm="12" md="12" lg="12" style={{ marginTop: -30, }}>
						<div className="caja caja-avatar caja-lg">
							<div className="caja-body">
								<div className="avatar">
									{ /* <i class="fas fa-user-graduate"></i> */}
									<img src={logo} />
								</div>
								<p className="text-center">Ingrese sus datos para registrarse al sistema, recuerde que la iglesia de la que es miembro debe confirmar su registro.</p>
								
								
								<form onSubmit={this.onSubmit}>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputNombre">Nombres</Label>
												<Input
													value={Nombre}
													onChange={event => this.setState(byPropKey('Nombre', event.target.value))}
													type="text"
													name="Nombre"
													id="inputNombre"
													placeholder="Nombre..." />
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputApellidos">Apellidos</Label>
												<Input
													value={Apellidos}
													onChange={event => this.setState(byPropKey('Apellidos', event.target.value))}
													type="text"
													name="Apellidos"
													id="inputApellidos"
													placeholder="Apellidos..." />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputNacimiento">Fecha de nacimiento</Label>
												<MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
													<div className="picker">
														<DatePicker
															value={Nacimiento}
															format="DD/MM/YYYY"
															onChange={this.handleDateChange}
														/>
													</div>
												</MuiPickersUtilsProvider>
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputTelefono">Telefono</Label>
												<Input
													value={Telefono}
													onChange={event => this.setState(byPropKey('Telefono', event.target.value))}
													type="text"
													name="Telefono"
													id="inputTelefono"
													placeholder="Telefono..." />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputIglesia">Congregacion</Label>
												<Input 
													value={Iglesia}
													type="select" 
													name="Iglesia" 
													id="inputIglesia" 
													placeholder="Iglesia..."
													onChange={ this.changeIglesia }
												>
													<option value="">-- Seleccionar Congregación --</option>
													<option>ICC Dulce Refugio (Madrid)</option>
													<option>ICC Santa Rosita</option>
													<option>ICC Patio Bonito</option>
													<option>ICC Facatativa</option>
													<option>ICC Mosquera</option>
													<option>Otra</option>
												</Input>
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputCargo">Cargo</Label>
												<Input
													value={Cargo}
													type="select"
													name="Cargo"
													id="inputCargo"
													placeholder="Cargo..."
													onChange={event => this.setState(byPropKey('Cargo', event.target.value))}
												>
													<option value="">-- Seleccionar Cargo --</option>
													<option>Invitado</option>
													<option>Miembro</option>
													<option>Servidor</option>
													<option>Lider</option>
													<option>Pastor</option>
													<option>Otro</option>
												</Input>
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputEmail">Email</Label>
												<Input
													value={Email}
													onChange={event => this.setState(byPropKey('Email', event.target.value))}
													type="email"
													name="Email"
													id="inputEmail"
													placeholder="Email..." />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputPass">Contraseña</Label>
												<Input
													value={passwordOne}
													onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
													type="password"
													name="passwordOne"
													id="inputPass"
													placeholder="Contraseña..." />
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputPassTwo">Confirmar contraseña</Label>
												<Input
													value={passwordTwo}
													onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
													type="password"
													name="passwordTwo"
													id="inputPassTwo"
													placeholder="Confirmar contraseña..." />
											</FormGroup>
										</Col>
									</Row>
									<Row className="justify-content-center">
										<Col xs="12" sm="6" md="4" lg="4">
											<Button size="md" color="secondary" block disabled={isInvalid} type="submit">Registrarme</Button>
										</Col>
									</Row>

									{ error && <p>{error.message}</p> }
								</form>
							</div>

						</div>

						<Modal isOpen={this.state.crearIglesia} toggle={this.toggle} className={this.props.className}>
							<ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
							<ModalBody>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</ModalBody>
							<ModalFooter>
								<Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
								<Button color="secondary" onClick={this.toggle}>Cancel</Button>
							</ModalFooter>
						</Modal>

					</Col>
				</Row>
			</Container>
		);
	}
}

const SignUpLink = () =>
	<p className="text-register">
		¿No tienes cuenta.? {' '} <Link className="enlace" to={routes.REGISTRATE}>Registrate</Link>
	</p>

export default withRouter(SignUpPage);

export {
	SignUpForm,
	SignUpLink,
};