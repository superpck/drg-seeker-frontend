import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'drg-seeker',
		loadComponent: () =>
			import('./pages/drg-seeker/drg-seeker.page').then((module) => module.DrgSeekerPageComponent)
	},
	{
		path: 'login',
		loadComponent: () =>
			import('./pages/login/login.page').then((module) => module.LoginPageComponent)
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];
