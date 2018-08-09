import React, { Component } from 'react';
import { Container, Row, Col, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { db } from '../firebase';
import { format } from "date-fns";
import uuid from 'uuid';
import Autocomplete from 'react-autocomplete';
import withAuthorization from '../components/withAuthorization';
import * as COPI from '../constants/copis';

const PaisesPage = ({ history }) => <ListaPaises history={history} />

const INITIAL_STATE = {
    Paises: [],
    Buscar: '',
    PaisId: '',
    PaisNombre: '',
    PaisEstado: '',
    PaisSelect: '',
    OptionsEstado: [{ value: 1, label: 'Activo' }, { value: 2, label: 'Inactivo' }],
    Registro: format(new Date(), 'MM/DD/YYYY'),
    error: null,
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
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
        db.onGetPaises().on('value', snapshot => 
            this.addPaises(snapshot, 'Nombre', 'asc')
        )
    }

    addPaises = (data, key, orden) => {
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
            Paises: items,
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

    changeRol = (val, item) => {
        this.setState({
            PaisSelect: val,
            PaisEstado: item.value
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
            PaisNombre,
            PaisEstado,
            Registro,
        } = this.state;

        const {
            history,
        } = this.props;

        db.doCreatePais(uuid.v4(), PaisNombre, PaisEstado, Registro)
            .then(() => {
                this.setState(() => ({ 
                    PaisNombre: '',
                    PaisEstado: '',
                    PaisSelect: '',
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
            PaisId,
            PaisNombre,
            PaisEstado,
            Registro,
        } = this.state;

        db.doEditPais(PaisId, PaisNombre, PaisEstado, Registro)
            .then(() => {
                this.setState(() => ({ 
                    PaisId: '',
                    PaisNombre: '',
                    PaisEstado: '',
                    PaisSelect: '',
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
            Paises,
            Buscar,
            Error,
            PaisNombre,
            PaisEstado,
            PaisSelect,
            OptionsEstado,
            modal,
            editando,
            cargando,
        } = this.state;

        const isInvalid = PaisNombre === '' || PaisEstado === '';

        return (
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: this.state.windowHeight - 70 }}>
                    <Col xs="12" sm="8" md="8" lg="8" style={{ marginTop: -30, }}>
                        <div className="caja caja-avatar caja-lg">
                            <div className="caja-body">
                                <div className="titulo-flex">
                                    <div className="espacios"></div>
                                    <div className="modal-header">
                                        <h5 className="modal-title">{COPI.PAISTITULO}</h5>
                                    </div>
                                    <div className="espacios"></div>
                                </div>

                                <p className="text-center">{COPI.PAISSUBTITULO}</p>

                                <Row className="justify-content-center align-items-center m-bottom-30">
                                    <Col xs="12" sm="8" md="8" lg="8">
                                        <form >
                                            <FormGroup>
                                                <Input
                                                    value={Buscar}
                                                    onChange={event => this.setState(byPropKey('Buscar', event.target.value))}
                                                    type="text"
                                                    placeholder={COPI.BUSCAR}
                                                    id="inputBuscar" />
                                            </FormGroup>
                                        </form>
                                    </Col>
                                    <Col xs="12" sm="4" md="4" lg="4">
                                        <Button color="primary" block onClick={this.toggle} style={{marginBottom: '1rem'}}>{COPI.BTNAGREGAR}</Button>
                                    </Col>
                                </Row>

                                {
                                    !cargando &&
                                    Paises.map((item, index) =>
                                        {
                                            item['Label'] = item.Estado === 1 ? 'Activo' : 'Inactivo';
                                            if( (item.Nombre.toLowerCase().search(Buscar.toLowerCase()) > -1 ) )
                                            return(
                                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center" >
                                                    <p className="texto-principal" style={{ color: item.Estado !== 1 ? '#b7b7b7' : '#5b5b5b', textDecorationLine: item.Estado !== 1 ? 'line-through' : 'none'}}>{item.Nombre}</p>
                                                    <Button color="link" onClick={ () => this.setState({PaisNombre: item.Nombre, PaisSelect: item.Label, PaisId: item.key, modal: true, editando: true}) }><i className="fas fa-pencil-alt"></i></Button>
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
                                <ModalHeader>{ !editando ? COPI.PAISTITULOAGREGAR : COPI.PAISTITULOEDITAR}</ModalHeader>
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
                                        <p className="text-center">{COPI.PAISDESCRIBCIONFORM}</p>
                                        <form >
                                            <Row>
                                                <Col xs="12" sm="12" md="12" lg="12">
                                                    <FormGroup>
                                                        <Label className="label" for="inputPaisNombre">País<span className="texto-danger">*</span></Label>
                                                        <Input
                                                            value={PaisNombre}
                                                            onChange={event => this.setState(byPropKey('PaisNombre', event.target.value))}
                                                            type="text"
                                                            name="PaisNombre"
                                                            id="inputPaisNombre" />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="12" md="12" lg="12">
                                                    <FormGroup>
                                                        <Label className="label" for="inputIglesia">Estado  <span className="texto-danger">*</span></Label>
                                                        <Autocomplete
                                                            value={PaisSelect}
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
                                                            onChange={(event, value) => this.setState({ PaisSelect: value })}
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
                                <Button color="primary" onClick={this.toggle}>{COPI.BTNCANCELAR}</Button>
                                {' '}
                                {
                                    !editando ?
                                    <Button color="secondary" onClick={this.onSubmit} disabled={isInvalid}>{COPI.BTNAGREGAR}</Button>
                                    :
                                    <Button color="secondary" onClick={this.onSubmitEdit}>{COPI.BTNEDITAR}</Button>
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
export default withAuthorization(authCondition)(PaisesPage);
