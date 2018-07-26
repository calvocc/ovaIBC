import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { auth, db } from '../firebase';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import {DatePicker} from 'material-ui-pickers';
import esLocale from 'date-fns/locale/es';
import {format} from "date-fns";
import uuid from 'uuid';

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
	IglesiaNombre: '',
	IglesiaTelefono: '',
	IglesiaDireccion: '',
	IglesiaPastor: '',
	IglesiaPais: '',
	IglesiaCiudad: '',
	Iglesias: null,
	Paises: null,
	Ciudades: null,
	Confirmada: false,
	errorIglesia: null,
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
		db.onGetIglesias().on('value', snapshot => {
			this.setState({
				Iglesias: snapshot.val()
			})
		})
		db.onGetPaises().orderByChild('Estado').equalTo(1).on('value', snapshot => {
			this.setState({
				Paises: snapshot.val()
			})
		})
		db.onGetCiudades().orderByChild('Estado').equalTo(1).on('value', snapshot => {
			this.setState({
				Ciudades: snapshot.val()
			})
		})
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
		db.onGetIglesias().off()
		db.onGetPaises().off()
		db.onGetCiudades().off()
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

	onSubmitIglesia = (event) => {
		const {
			IglesiaNombre,
			IglesiaTelefono,
			IglesiaDireccion,
			IglesiaPastor,
			IglesiaPais,
			IglesiaCiudad,
			Registro,
			Confirmada
		} = this.state;
		
		
		db.doCreateIglesia( uuid.v4(), IglesiaNombre, IglesiaTelefono, IglesiaDireccion, IglesiaPastor, IglesiaPais, IglesiaCiudad, Registro, Confirmada)
			.then(() => {
				this.setState({ 
					Iglesia: IglesiaNombre,
					crearIglesia : !this.state.crearIglesia
				});

			})
			.catch(error => {
				this.setState(byPropKey({
					'errorIglesia': error,
					crearIglesia: !this.state.crearIglesia
				}));
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
			IglesiaNombre,
			IglesiaTelefono,
			IglesiaDireccion,
			IglesiaPastor,
			IglesiaPais,
			IglesiaCiudad,
			errorIglesia,
			Iglesias,
			Paises,
			Ciudades
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			Email === '' ||
			Nombre === '';

		const isInvalidIglesia = 
			IglesiaNombre === '' || 
			IglesiaTelefono === '' || 
			IglesiaPastor === '';

		console.log(Paises)

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
													{!!Iglesias && <IglesiasOption Iglesias={Iglesias} />}
													<option value="Otra">Otra</option>
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

						<Modal isOpen={this.state.crearIglesia} toggle={this.toggle} className="ova-modal">
							<div className="titulo-flex">
								<div className="espacios"></div>
								<ModalHeader>Agregar Iglesia</ModalHeader>
								<div className="espacios"></div>
							</div>
							<ModalBody>
								<p className="text-center">Ingrese los datos a continuacion para agregar una iglesia.</p>
								<form >
									<Row>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesiaNombre">Nombre de la congregación <span className="texto-danger">*</span></Label>
												<Input
													value={IglesiaNombre}
													onChange={event => this.setState(byPropKey('IglesiaNombre', event.target.value))}
													type="text"
													name = "IglesiaNombre"
													id="inputIglesiaNombre"
													placeholder="Nombre de la congregación..." />
											</FormGroup>
										</Col>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesiaTelefono">Telefono <span className="texto-danger">*</span></Label>
												<Input
													value={IglesiaTelefono}
													onChange={event => this.setState(byPropKey('IglesiaTelefono', event.target.value))}
													type="text"
													name="IglesiaTelefono"
													id="inputIglesiaTelefono"
													placeholder="Telefono..." />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesiaDireccion"> Dirección </Label>
												<Input
													value={IglesiaDireccion}
													onChange={event => this.setState(byPropKey('IglesiaDireccion', event.target.value))}
													type="text"
													name="IglesiaDireccion"
													id="inputIglesiaDireccion"
													placeholder="Dirección..." />
											</FormGroup>
										</Col>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesiaPastor">Pastor General <span className="texto-danger">*</span></Label>
												<Input
													value={IglesiaPastor}
													onChange={event => this.setState(byPropKey('IglesiaPastor', event.target.value))}
													type="text"
													name="IglesiaPastor"
													id="inputIglesiaPastor"
													placeholder="Nombre del pastor..." />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesia">País</Label>
												<Input
													value={IglesiaPais}
													type="select"
													name="IglesiaPais"
													id="inputIglesiaPais"
													placeholder="País..."
													onChange={event => this.setState(byPropKey('IglesiaPais', event.target.value))}
												>
													<option value="">-- Seleccionar País --</option>
													{!!Paises && <PaisesOption Paises={Paises} />}
												</Input>
											</FormGroup>
										</Col>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesiaCiudad">Ciudad</Label>
												<Input
													value={IglesiaCiudad}
													type="select"
													name="IglesiaCiudad"
													id="inputIglesiaCiudad"
													placeholder="IglesiaCiudad..."
													onChange={event => this.setState(byPropKey('IglesiaCiudad', event.target.value))}
												>
													<option value="">-- Seleccionar Ciudad --</option>
													{!!Ciudades && <CiudadesOption Ciudades={Ciudades} />}
												</Input>
											</FormGroup>
										</Col>
									</Row>

									{errorIglesia && <p>{errorIglesia.message}</p>}
								</form>
							</ModalBody>
							<ModalFooter>
								<Button color="secondary" onClick={this.onSubmitIglesia} disabled={isInvalidIglesia}>Agregar</Button>{' '}
								<Button color="primary" onClick={this.toggle}>Cancelar</Button>
							</ModalFooter>
						</Modal>

					</Col>
				</Row>
			</Container>
		);
	}
}

const IglesiasOption = ({ Iglesias }) => Object.keys(Iglesias).map(key => <option key={key}>{Iglesias[key].Nombre}</option>)
const PaisesOption = ({ Paises }) =>  Object.keys(Paises).map(key => <option key={key}>{Paises[key].Nombre}</option>)
const CiudadesOption = ({ Ciudades }) =>  Object.keys(Ciudades).map(key => <option key={key}>{Ciudades[key].Nombre}</option>)


const SignUpLink = () =>
	<p className="text-register">
		¿No tienes cuenta.? {' '} <Link className="enlace" to={routes.REGISTRATE}>Registrate</Link>
	</p>

export default withRouter(SignUpPage);

export {
	SignUpForm,
	SignUpLink,
};