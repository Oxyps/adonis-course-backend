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
				builder.select(['id', 'name']);
			})
			.fetch();

		return courses;
	}

	/**
	 * Render a form to be used for creating a new course.
	 * GET courses/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create({ request, response, view }) {}

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
	 * Render a form to update an existing course.
	 * GET courses/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit({ params, request, response, view }) {}

	/**
	 * Update course details.
	 * PUT or PATCH courses/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response }) {}

	/**
	 * Delete a course with id.
	 * DELETE courses/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {}
}

module.exports = CourseController;
