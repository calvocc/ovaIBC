import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { auth, db } from '../firebase';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import {DatePicker} from 'material-ui-pickers';
import esLocale from 'date-fns/locale/es';
import {format} from "date-fns";
import uuid from 'uuid';
import Autocomplete from 'react-autocomplete';

import * as routes from '../constants/routes';

const SignUpPage = ({ history }) => <SignUpForm history={history} />

const INITIAL_STATE = {
	Nombre: '',
	Apellidos: '',
	Telefono: '',
	Email: '',
	Iglesia: '',
	OptionsIglesias: [],
	selectIglesia: '',
	Nacimiento: null,
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
	Paises: null,
	OptionsPaises: [],
	Ciudades: null,
	OptionsCiudades: [],
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
		this.changeIglesia = this.changeIglesia.bind(this);
		this.addIglesias = this.addIglesias.bind(this);
		this.addPaises = this.addPaises.bind(this);
		this.addCiudades = this.addCiudades.bind(this);
	}

	componentDidMount() {
		this.handleResize();
		window.addEventListener('resize', this.handleResize)
		db.onGetIglesias().on('value', this.addIglesias)
		db.onGetPaises().orderByChild('Estado').equalTo(1).on('value', this.addPaises)
		db.onGetCiudades().orderByChild('Estado').equalTo(1).on('value', this.addCiudades)
	}

	addIglesias = (data) => {
		const items = [{value: 'Otra', label: 'Otra'}];
		data.forEach(dataItem => {
			const item = dataItem.val();
			const dataOptions = {
				value: item.Nombre, label: item.Nombre
			}
			items.push(dataOptions);
		})
		this.setState({
			OptionsIglesias: items
		})
	}

	addPaises = (data) => {
		const items = [];
		data.forEach(dataItem => {
			const item = dataItem.val();
			const dataOptions = {
				value: item.Nombre, label: item.Nombre
			}
			items.push(dataOptions);
		})
		this.setState({
			OptionsPaises: items
		})
	}

	addCiudades = (data) => {
		const items = [];
		data.forEach(dataItem => {
			const item = dataItem.val();
			const dataOptions = {
				value: item.Nombre, label: item.Nombre
			}
			items.push(dataOptions);
		})
		this.setState({
			OptionsCiudades: items
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

	changeIglesia = (val) => {
		if (val === "Otra") {
			this.setState({
				crearIglesia: true,
			})
		} else {
			this.setState({
				Iglesia: val
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
				db.doCreateUser(authUser.user.uid, Nombre, Apellidos, Telefono, Email, Iglesia, Nacimiento, Registro, Rol)
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
			OptionsIglesias,
			OptionsPaises,
			OptionsCiudades
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			Email === '' ||
			Nombre === '' ||
			Apellidos === '' ||
			Telefono === '' ||
			Iglesia === '' ||
			Nacimiento === '';

		const isInvalidIglesia = 
			IglesiaNombre === '' || 
			IglesiaTelefono === '' || 
			IglesiaPastor === '';

		return (
			<Container>
				<Row className="justify-content-center align-items-center" style={{ minHeight: this.state.windowHeight - 70 }}>
					<Col xs="12" sm="12" md="12" lg="12" style={{ marginTop: -30, }}>
						<div className="caja caja-avatar caja-lg">
							<div className="caja-body">
								<div className="titulo-flex">
									<div className="espacios"></div>
									<div className="modal-header">
										<h5 className="modal-title">Registro de Usuarios</h5>
									</div>
									<div className="espacios"></div>
								</div>
								
								<p className="text-center">Ingrese sus datos para hacer parte del Instituto Virtual Cuadrangular </p>
								
								
								<form onSubmit={this.onSubmit}>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputNombre">Nombre  <span className="texto-danger">*</span></Label>
												<Input
													value={Nombre}
													onChange={event => this.setState(byPropKey('Nombre', event.target.value))}
													type="text"
													name="Nombre"
													id="inputNombre" />
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputApellidos">Apellidos  <span className="texto-danger">*</span></Label>
												<Input
													value={Apellidos}
													onChange={event => this.setState(byPropKey('Apellidos', event.target.value))}
													type="text"
													name="Apellidos"
													id="inputApellidos" />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputNacimiento">Fecha de nacimiento  <span className="texto-danger">*</span></Label>
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
												<Label className="label" for="inputTelefono">Telefono  <span className="texto-danger">*</span></Label>
												<Input
													value={Telefono}
													onChange={event => this.setState(byPropKey('Telefono', event.target.value))}
													type="text"
													name="Telefono"
													id="inputTelefono" />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputIglesia">Congregacion  <span className="texto-danger">*</span></Label>
												<Autocomplete
													value={Iglesia}
													wrapperStyle={{display: 'flex', flex: 1, flexDirection: 'column', position: 'relative'}}
													menuStyle={{
														boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
														background: 'rgba(255, 255, 255, 0.9)',
														padding: '2px 0',
														overflow: 'auto',
														maxHeight: '200px',
														position: 'absolute',
														top: '100%',
														left: '0px',
														rigth: '0px',
														zIndex: 5
													}}
													getItemValue={(item) => item.label}
													items={OptionsIglesias}
													shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
													renderItem={(item, isHighlighted) =>
														<div key={item.label} className="itemSelect" style={{ background: isHighlighted ? '#673ab7' : 'white', color: isHighlighted ? '#ffffff' : '#a7a7a7' }}>
															{item.label}
														</div>
													}
													onChange={(event, value) => this.setState({ Iglesia: value })}
													onSelect={this.changeIglesia}
												/>
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputEmail">Email  <span className="texto-danger">*</span></Label>
												<Input
													value={Email}
													onChange={event => this.setState(byPropKey('Email', event.target.value))}
													type="email"
													name="Email"
													id="inputEmail" />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputPass">Contraseña  <span className="texto-danger">*</span></Label>
												<Input
													value={passwordOne}
													onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
													type="password"
													name="passwordOne"
													id="inputPass" />
											</FormGroup>
										</Col>
										<Col xs="12" sm="6" md="6" lg="6">
											<FormGroup>
												<Label className="label" for="inputPassTwo">Confirmar contraseña  <span className="texto-danger">*</span></Label>
												<Input
													value={passwordTwo}
													onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
													type="password"
													name="passwordTwo"
													id="inputPassTwo" />
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
													id="inputIglesiaNombre" />
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
													id="inputIglesiaTelefono" />
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
													id="inputIglesiaDireccion" />
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
													id="inputIglesiaPastor" />
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesia">País</Label>
												<Autocomplete
													value={IglesiaPais}
													wrapperStyle={{ display: 'flex', flex: 1, flexDirection: 'column', position: 'relative' }}
													menuStyle={{
														boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
														background: 'rgba(255, 255, 255, 0.9)',
														padding: '2px 0',
														overflow: 'auto',
														maxHeight: '200px',
														position: 'absolute',
														top: '100%',
														left: '0px',
														rigth: '0px',
														zIndex: 5
													}}
													getItemValue={(item) => item.label}
													items={OptionsPaises}
													shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
													renderItem={(item, isHighlighted) =>
														<div key={item.label} className="itemSelect" style={{ background: isHighlighted ? '#673ab7' : 'white', color: isHighlighted ? '#ffffff' : '#a7a7a7' }}>
															{item.label}
														</div>
													}
													onChange={(event, value) => this.setState({ IglesiaPais: value })}
													onSelect={val => this.setState({ IglesiaPais: val })}
												/>
											</FormGroup>
										</Col>
										<Col xs="12" sm="12" md="12" lg="12">
											<FormGroup>
												<Label className="label" for="inputIglesiaCiudad">Ciudad</Label>
												<Autocomplete
													value={IglesiaCiudad}
													wrapperStyle={{ display: 'flex', flex: 1, flexDirection: 'column', position: 'relative' }}
													menuStyle={{
														boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
														background: 'rgba(255, 255, 255, 0.9)',
														padding: '2px 0',
														overflow: 'auto',
														maxHeight: '200px',
														position: 'absolute',
														top: '100%',
														left: '0px',
														rigth: '0px',
														zIndex: 5
													}}
													getItemValue={(item) => item.label}
													items={OptionsCiudades}
													shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
													renderItem={(item, isHighlighted) =>
														<div key={item.label} className="itemSelect" style={{ background: isHighlighted ? '#673ab7' : 'white', color: isHighlighted ? '#ffffff' : '#a7a7a7' }}>
															{item.label}
														</div>
													}
													onChange={(event, value) => this.setState({ IglesiaCiudad: value })}
													onSelect={val => this.setState({ IglesiaCiudad: val })}
												/>
											</FormGroup>
										</Col>
									</Row>

									{errorIglesia && <p>{errorIglesia.message}</p>}
								</form>
							</ModalBody>
							<ModalFooter>
								<Button color="primary" onClick={this.toggle}>Cancelar</Button>
								{' '}
								<Button color="secondary" onClick={this.onSubmitIglesia} disabled={isInvalidIglesia}>Agregar</Button>
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