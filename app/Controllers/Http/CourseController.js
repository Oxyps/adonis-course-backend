/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Course = use('App/Models/Course');

/**
 * Resourceful controller for interacting with courses
 */
class CourseController {
	/**
	 * Show a list of all courses.
	 * GET courses
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index() {
		const courses = await Course.query()
			.with('user', builder => {
				builder.select(['id', 'name', 'avatar']);
			})
			.fetch();

		return courses;
	}

	/**
	 * Create/save a new course.
	 * POST courses
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request }) {
		const data = request.only(['user_id', 'name', 'description', 'class']);

		const course = await Course.create(data);

		return course;
	}

	/**
	 * Display a single course.
	 * GET courses/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params }) {
		const course = await Course.find(params.id);
		await course.load('user', builder => {
			builder.select(['id', 'name', 'github', 'occupation', 'avatar']);
		});

		return course;
	}

	/**
	 * Update course details.
	 * PUT or PATCH courses/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request }) {
		const data = request.only(['user_id', 'name', 'description', 'class']);

		const course = await Course.find(params.id);

		course.merge(data);

		await course.save();

		return course;
	}

	/**
	 * Delete a course with id.
	 * DELETE courses/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params }) {
		const course = await Course.find(params.id);

		await course.delete();
	}
}

module.exports = CourseController;
