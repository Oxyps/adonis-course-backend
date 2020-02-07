/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.post('/sessions', 'SessionController.store').validator('Session');

Route.group(() => {
	Route.post('/forgot-password', 'ForgotPasswordController.store').validator(
		'ForgotPassword'
	);
	Route.post('/reset-password', 'ResetPasswordController.store').validator(
		'ResetPassword'
	);

	Route.get('/courses', 'CourseController.index');
	Route.get('/courses/:id', 'CourseController.show');
	Route.post('/courses', 'CourseController.store').validator('Course');
}).middleware('auth:jwt');
