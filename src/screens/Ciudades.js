import React, { Component } from 'react';
import { Container, Row, Col, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { db } from '../firebase';
import { format } from "date-fns";
import uuid from 'uuid';
import Autocomplete from 'react-autocomplete';
import withAuthorization from '../components/withAuthorization';

const CiudadesPage = ({ history }) => <ListaPaises history={history} />

const INITIAL_STATE = {
    OptionsPaises: [],
    Pais: '',
    Buscar: '',
    Ciudades: [],
    CiudadId: '',
    CiudadNombre: '',
    CiudadEstado: '',
    CiudadSelect: '',
    OptionsEstado: [{ value: 1, label: 'Activo' }, { value: 2, label: 'Inactivo' }],
    Registro: format(new Date(), 'MM/DD/YYYY'),
    error: null,
    errorPais: false,
    modal: false,
    editando: false,
    cargando: true,
    windowHeight: 0,
    windowWidth: 0
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class ListaPaises extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
        this.toggle = this.toggle.bind(this);
        this.toggleEditar = this.toggle.bind(this);
        this.changeRol = this.changeRol.bind(this);
        this.addPaises = this.addPaises.bind(this);
        this.addCiudades = this.addCiudades.bind(this);
        this.selectPais = this.selectPais.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
        db.onGetPaises().on('value', snapshot =>
         this.addPaises(snapshot, 'label', 'asc')
        )
        db.onGetCiudades().on('value', snapshot => 
            this.addCiudades(snapshot, 'Nombre', 'asc')
        )
    }

    addPaises = (data, key, orden) => {
        const items = [{value: 'Todos', label: '--Todos--'}];
        data.forEach(dataItem => {
            const item = dataItem.val();
            const dataOptions = {
				value: item.Nombre, label: item.Nombre
            }
            items.push(dataOptions);
        })

        //Ordenar alfabeticamente
        items.sort(function (a, b) {
            var x = a[key],
                y = b[key];

            if (orden === 'asc') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            if (orden === 'desc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });

        this.setState({
            OptionsPaises: items,
            cargando: false
        })
    }

    addCiudades = (data, key, orden) => {
        const items = [];
        data.forEach(dataItem => {
            const item = dataItem.val();
            item['key'] = dataItem.key;
            items.push(item);
        })

        //Ordenar alfabeticamente
        items.sort(function (a, b) {
            var x = a[key],
                y = b[key];

            if (orden === 'asc') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            if (orden === 'desc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });

        this.setState({
            Ciudades: items,
            cargando: false
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        db.onGetPaises().off()
    }

    handleResize = () => this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    });

    selectPais = (val, item) => {
        this.setState({
            cargando: true,
            Pais: val,
            PaisLabel: item.value
        })
        if(item.value === 'Todos'){
            db.onGetCiudades().on('value', snapshot => 
                this.addCiudades(snapshot, 'Nombre', 'asc')
            )
        } else {
            db.onGetCiudades().orderByChild('Pais').equalTo(item.value).on('value', snapshot => 
                this.addCiudades(snapshot, 'Nombre', 'asc')
            )
        }
    }

    changeRol = (val, item) => {
        this.setState({
            CiudadSelect: val,
            CiudadEstado: item.value
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            editando: false,
            PaisEstado: '',
            PaisNombre: '',
            PaisId: '',
        });
    }

    toggleEditar() {
        this.setState({
            modalEditar: !this.state.modalEditar
        });
    }

    onSubmit = (event) => {
        this.setState({
            cargando: true
        })
        const {
            Pais,
            CiudadNombre,
            CiudadEstado,
            Registro,
        } = this.state;

        const {
            history,
        } = this.props;

        db.doCreateCiudad(uuid.v4(), Pais, CiudadNombre, CiudadEstado, Registro)
            .then(() => {
                this.setState(() => ({ 
                    CiudadNombre: '',
                    CiudadEstado: '',
                    CiudadSelect: '',
                    modal: false,
                    cargando: false
                 }));
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });
            

        event.preventDefault();
    }

    onSubmitEdit = (event) => {
        this.setState({
            cargando: true
        })
        const {
            CiudadId,
            CiudadNombre,
            CiudadEstado,
            Pais,
            Registro,
        } = this.state;

        db.doEditCiudad(CiudadId, Pais, CiudadNombre, CiudadEstado, Registro)
            .then(() => {
                this.setState(() => ({ 
                    CiudadId: '',
                    CiudadNombre: '',
                    CiudadEstado: '',
                    CiudadSelect: '',
                    modal: false,
                    cargando: false,
                    editando: false
                 }));
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();

    }

    render() {
        const {
            OptionsPaises,
            Pais,
            Ciudades,
            Buscar,
            errorPais,
            CiudadNombre,
            CiudadEstado,
            CiudadSelect,
            OptionsEstado,
            modal,
            editando,
            cargando,
        } = this.state;

        const isInvalid = Pais === '--Todos--' || CiudadNombre === '' || CiudadEstado === '';

        return (
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: this.state.windowHeight - 70 }}>
                    <Col xs="12" sm="8" md="8" lg="8" style={{ marginTop: -30, }}>
                        <div className="caja caja-avatar caja-lg">
                            <div className="caja-body">
                                <div className="titulo-flex">
                                    <div className="espacios"></div>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Listado de ciudades o municipios</h5>
                                    </div>
                                    <div className="espacios"></div>
                                </div>

                                <p className="text-center">Las ciudades acontinuación son las que se encuentran registrados en la plataforma.</p>
                                <form >
                                    <Row className="justify-content-center align-items-center">
                                        <Col xs="12" sm="12" md="12" lg="12">
                                            <FormGroup>
                                                <Label className="label" for="inputPais">Filtrar por país.</Label>
                                                <Autocomplete
													value={Pais}
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
													onChange={(event, value) => this.setState({ Pais: value })}
													onSelect={this.selectPais}
												/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center align-items-center m-bottom-30">
                                        <Col xs="12" sm="8" md="8" lg="8">
                                            <FormGroup>
                                                <Input
                                                    value={Buscar}
                                                    onChange={event => this.setState(byPropKey('Buscar', event.target.value))}
                                                    type="text"
                                                    placeholder="Buscar..."
                                                    id="inputBuscar" />
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="4" md="4" lg="4">
                                            <Button color="primary" block onClick={this.toggle} style={{marginBottom: '1rem'}}>Agregar</Button>
                                        </Col>
                                    </Row>
                                </form>
                                {
                                    !cargando &&
                                    Ciudades.map((item, index) =>
                                        {
                                            item['Label'] = item.Estado === 1 ? 'Activo' : 'Inactivo';
                                            if( (item.Nombre.toLowerCase().search(Buscar.toLowerCase()) > -1 ) )
                                            return(
                                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ color: item.Estado !== 1 ? '#efefef' : '#5b5b5b'}}>
                                                    {item.Nombre}
                                                    <Button color="link" onClick={ () => this.setState({CiudadNombre: item.Nombre, CiudadSelect: item.Label, CiudadEstado: item.Estado, CiudadId: item.key, Pais: item.Pais, modal: true, editando: true}) }><i className="fas fa-pencil-alt"></i></Button>
                                                </div>
                                            )
                                        }
                                    )
                                }
                                {
                                    cargando &&
                                    <div className="conten-loader">
                                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                    </div>
                                }
                                
                            </div>

                        </div>

                        <Modal isOpen={this.state.modal} toggle={this.toggle} className="ova-modal">
                            <div className="titulo-flex">
                                <div className="espacios"></div>
                                <ModalHeader>{ !editando ? 'Agregar Ciudad' : 'Editar Ciudad'}</ModalHeader>
                                <div className="espacios"></div>
                            </div>

                            <ModalBody>
                                {
                                    cargando &&
                                    <div className="conten-loader">
                                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                    </div>
                                }
                                {
                                    !cargando &&
                                    <div>
                                        <p className="text-center">Ingrese los datos a continuacion para agregar una ciudad o municipio desde el cual se podra acceder a la plataforma.</p>
                                        <form >
                                            <Row>
                                                <Col xs="12" sm="12" md="12" lg="12">
                                                    <FormGroup>
                                                        <Label className="label" for="inputPaisNombre">País<span className="texto-danger">*</span></Label>
                                                        <Autocomplete
                                                            value={Pais}
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
                                                            onChange={(event, value) => this.setState({ Pais: value })}
                                                            onSelect={this.selectPais}
                                                        />
                                                        { Pais === '--Todos--' && <p className="text-danger">Debe seleccionar un pais valido</p>}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="12" md="12" lg="12">
                                                    <FormGroup>
                                                        <Label className="label" for="inputCiudadNombre">Ciudad o Municipio<span className="texto-danger">*</span></Label>
                                                        <Input
                                                            value={CiudadNombre}
                                                            onChange={event => this.setState(byPropKey('CiudadNombre', event.target.value))}
                                                            type="text"
                                                            name="CiudadNombre"
                                                            id="inputCiudadNombre" />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="12" md="12" lg="12">
                                                    <FormGroup>
                                                        <Label className="label" for="inputIglesia">Estado  <span className="texto-danger">*</span></Label>
                                                        <Autocomplete
                                                            value={CiudadSelect}
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
                                                            items={OptionsEstado}
                                                            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                                            renderItem={(item, isHighlighted) =>
                                                                <div key={item.label} className="itemSelect" style={{ background: isHighlighted ? '#673ab7' : 'white', color: isHighlighted ? '#ffffff' : '#a7a7a7' }}>
                                                                    {item.label}
                                                                </div>
                                                            }
                                                            onChange={(event, value) => this.setState({ CiudadSelect: value })}
                                                            onSelect={this.changeRol}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </form>
                                    </div>
                                }

                                {Error && <p>{Error.message}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggle}>Cancelar</Button>
                                {' '}
                                {
                                    !editando ?
                                    <Button color="secondary" onClick={this.onSubmit} disabled={isInvalid}>Agregar</Button>
                                    :
                                    <Button color="secondary" onClick={this.onSubmitEdit}>Editar</Button>
                                }
                            </ModalFooter>
                        </Modal>


                    </Col>
                </Row>
            </Container>
        );
    }
}

const authCondition = (authUser) => !!authUser && authUser.Rol >= 3;
export default withAuthorization(authCondition)(CiudadesPage);
