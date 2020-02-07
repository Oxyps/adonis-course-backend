const Antl = use('Antl');
const { rule } = use('Validator');

class Course {
	get validateAll() {
		return true;
	}

	get rules() {
		// return {
		// 	name: 'required',
		// 	description: 'required',
		// 	class: 'required|in:1,2,3',
		// 	user_id: 'required|exists:users,id',
		// };

		return {
			name: [rule('required')],
			description: [rule('required')],
			class: [rule('required'), rule('in', [1, 2, 3])],
			user_id: [rule('exists', ['users', 'id'])],
		};
	}

	get messages() {
		return Antl.list('validation');
	}
}

module.exports = Course;
