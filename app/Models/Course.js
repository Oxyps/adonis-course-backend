/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Course extends Model {
	user() {
		return this.belongsTo('App/Models/User');
	}

	getClass(section) {
		return Number(section);
	}
}

module.exports = Course;
