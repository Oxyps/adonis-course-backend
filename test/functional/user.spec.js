const { test, trait } = use('Test/Suite')('Session');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const Helpers = use('Helpers');
const Hash = use('Hash');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to update user', async ({ assert, client }) => {
	const user = await Factory.model('App/Models/User').create({
		name: 'Abel',
		password: 'oldpassword',
	});

	const response = await client
		.put('/profile')
		.loginVia(user, 'jwt')
		.field('name', 'testname')
		.field('password', 'newpassword')
		.field('password_confirmation', 'newpassword')
		.attach('avatar', Helpers.tmpPath('test/avatar01.jpg'))
		.end();
	response.assertStatus(200);
	assert.equal(response.body.name, 'testname');
	assert.exists(response.body.avatar);

	await user.reload();

	assert.isTrue(await Hash.verify('newpassword', user.password));
});
