import { db } from './firebase';

// User API

export const doCreateUser = (id, Nombre, Apellidos, Telefono, Email, Iglesia, Nacimiento, Registro, Rol) =>
	db.ref(`Usuarios/${id}`).set({
		Nombre,
		Apellidos,
		Telefono,
		Email,
		Iglesia,
		Nacimiento,
		Registro,
		Rol
	});

export const onGetUsers = (id) =>
	db.ref(`Usuarios/${id}`).once('value');

export const onceGetUsers = () =>
	db.ref('Usuarios').once('value');


// Iglesias API
export const doCreateIglesia = (Id, Nombre, Telefono, Direccion, Pastor, Pais, Ciudad, Registro, Confirmada) => 
	db.ref(`Iglesias/${Id}`).set({
		Nombre, 
		Telefono, 
		Direccion, 
		Pastor, 
		Pais, 
		Ciudad, 
		Registro,
		Confirmada
	})

export const onGetIglesia = (id) =>
	db.ref(`Iglesias/${id}`).once('value');

export const onGetIglesias = () =>
	db.ref('Iglesias/')


// Locaciones APIs
export const doCreatePais = (Id, Nombre, Estado, Registro) =>
	db.ref(`Paises/${Id}`).set({
		Nombre,
		Estado,
		Registro
	})

export const doEditPais = (Id, Nombre, Estado, Registro) =>
	db.ref(`Paises/${Id}`).update({
		Nombre,
		Estado,
		Registro
	})

export const onGetPais = (id) =>
	db.ref(`Paises/${id}`).once('value');

export const onGetPaises = () =>
	db.ref('Paises/')

export const doCreateCiudad = (Id, Pais, Nombre, Estado, Registro) =>
	db.ref(`Ciudades/${Id}`).set({
		Nombre,
		Pais,
		Estado,
		Registro
	})

export const doEditCiudad = (Id, Pais, Nombre, Estado, Registro) =>
	db.ref(`Ciudades/${Id}`).update({
		Nombre,
		Pais,
		Estado,
		Registro
	})

export const onGetCiudad = (id) =>
	db.ref(`Ciudades/${id}`).once('value');

export const onGetCiudades = () =>
	db.ref('Ciudades/')