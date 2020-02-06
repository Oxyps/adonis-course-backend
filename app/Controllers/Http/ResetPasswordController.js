const TOKEN_EXPIRATION = 5;

const { parseISO, isBefore, subHours } = require('date-fns');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

class ResetPasswordController {
	async store({ request, response }) {
		const { token, password } = request.only(['token', 'password']);

		const userToken = await Token.findByOrFail('token', token);
		const user = await userToken.user().fetch();

		// token created at 5h should be able to reset until 9:59
		// at 10h token should expire

		// the verification is:
		// 		if created at 5 is before than [10.01 (now) - 5 (expiration)] = 5.01
		// 			its expired
		// 		else if created at 5 if after than [now 10.01 - expiration time 5] = 5.01
		// 			its valid
		if (
			isBefore(
				parseISO(userToken.created_at),
				subHours(new Date(), TOKEN_EXPIRATION)
			)
		) {
			return response
				.status(400)
				.json({ error: 'token expired (5 hours expiration).' });
		}

		user.password = password;

		await user.save();
	}
}

module.exports = ResetPasswordController;
