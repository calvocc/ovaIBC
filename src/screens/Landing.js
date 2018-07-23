import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const LandingPage = () =>
	<div>
		<Grid container spacing={20}>
			<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
				<h1>Landing Page</h1>
				<Button variant="contained" color="primary">
				Hello World
				</Button>
			</Grid>
			<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
				<h1>Landing Page</h1>
				<Button variant="contained" color="primary">
				Hello World
				</Button>
			</Grid>
		</Grid>
	</div>

export default LandingPage;