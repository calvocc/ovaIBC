import { db } from './firebase';

// User API

export const doCreateUser = (id, Nombre, Apellidos, Telefono, Email, Nacimiento, Registro, Rol) =>
	db.ref(`users/${id}`).set({
		Nombre,
		Apellidos,
		Telefono,
		Email,
		Nacimiento,
		Registro,
		Rol
	});

export const onGetUsers = (id) =>
	db.ref(`users/${id}`).once('value');

export const onceGetUsers = () =>
	db.ref('users').once('value');

// Other Entity APIs ...