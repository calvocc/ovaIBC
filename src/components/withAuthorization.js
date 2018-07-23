import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { db, firebase } from '../firebase';
import * as routes from '../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        
        componentDidMount() {
            firebase.auth.onAuthStateChanged(authUser => {
                if (authUser){
                    db.onGetUsers(authUser.uid).then(snapshot => {
                        if (!authCondition(snapshot.val())) {
                            this.props.history.push(routes.INICIO);
                        }
                    });
                } else {
                    this.props.history.push(routes.LOGIN);
                }
            });
        }
        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser => authUser ? <Component /> : null}
                </AuthUserContext.Consumer>
            );
        }
    }

    return withRouter(WithAuthorization);
}

export default withAuthorization;