const { format, subHours } = require('date-fns');

const { test, trait } = use('Test/Suite')('Forgot Password');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const Mail = use('Mail');
const Hash = use('Hash');
const Database = use('Database');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send reset pasword email', async ({ assert, client }) => {
	Mail.fake();

	const email = 'abel_castro_junior@hotmail.com';

	const user = await Factory.model('App/Models/User').create({ email });

	await client
		.post('/forgot-password')
		.send({ email })
		.end();

	const token = await user.tokens().first();

	const recentEmail = Mail.pullRecent();

	assert.equal(recentEmail.message.to[0].address, email);

	assert.include(token.toJSON(), {
		type: 'forgot-password',
	});

	Mail.restore();
});

test('it should reset password', async ({ assert, client }) => {
	const email = 'abel_castro_junior@hotmail.com';

	const user = await Factory.model('App/Models/User').create({ email });
	const userToken = await Factory.model('App/Models/Token').make();

	await user.tokens().save(userToken);

	await client
		.post('/reset-password')
		.send({
			token: userToken.token,
			password: '123456',
			password_confirmation: '123456',
		})
		.end();

	await user.reload();

	const checkPassword = await Hash.verify('123456', user.password);

	assert.isTrue(checkPassword);
});

test('it should expire the token after 5 hours', async ({ client }) => {
	const email = 'abel_castro_junior@hotmail.com';

	const user = await Factory.model('App/Models/User').create({ email });
	const userToken = await Factory.model('App/Models/Token').make();

	await user.tokens().save(userToken);

	const dateWithSub = format(subHours(new Date(), 6), 'yyyy-MM-dd HH:ii:ss');

	await Database.table('tokens')
		.where('token', userToken.token)
		.update('created_at', dateWithSub);

	await userToken.reload();

	const response = await client
		.post('/reset-password')
		.send({
			token: userToken.token,
			password: '123456',
			password_confirmation: '123456',
		})
		.end();

	response.assertStatus(400);
});
