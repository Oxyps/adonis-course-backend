const { test, trait } = use('Test/Suite')('Course');

/** @type {import('Adonis/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create courses', async ({ assert, client }) => {
	const user = await Factory.model('App/Models/User').create();

	const response = await client
		.post('/courses')
		.loginVia(user, 'jwt')
		.send({
			name: 'Django fullstack',
			description:
				'Aprendendo a desenvolver sistemas fullstack web com o Django framework utilizando Python como linguagem de programação.',
			class: 1,
			user_id: user.id,
		})
		.end();

	response.assertStatus(200);
	assert.exists(response.body.id);
});

test('it should be able to list all courses', async ({ assert, client }) => {
	const user = await Factory.model('App/Models/User').create();
	const course = await Factory.model('App/Models/Course').make();

	await user.courses().save(course);

	const response = await client
		.get('/courses')
		.loginVia(user, 'jwt')
		.end();

	response.assertStatus(200);

	assert.equal(response.body[0].name, course.name);
	assert.equal(response.body[0].user.id, user.id);
});

test('it should be able to list show a course', async ({ assert, client }) => {
	const user = await Factory.model('App/Models/User').create();
	const course = await Factory.model('App/Models/Course').create();

	await user.courses().save(course);

	const response = await client
		.get(`/courses/${course.id}`)
		.loginVia(user, 'jwt')
		.end();

	response.assertStatus(200);

	assert.equal(response.body.name, course.name);
	assert.equal(response.body.user.id, user.id);
});
