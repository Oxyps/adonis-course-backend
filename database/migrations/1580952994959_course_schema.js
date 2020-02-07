/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CourseSchema extends Schema {
	up() {
		this.create('courses', table => {
			table.increments();
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('SET NULL')
				.onUpdate('CASCADE');
			table.string('name').notNullable();
			table.text('description').notNullable();
			table.enu('class', [1, 2, 3]).notNullable();
			table.timestamps();
		});
	}

	down() {
		this.drop('courses');
	}
}

module.exports = CourseSchema;
