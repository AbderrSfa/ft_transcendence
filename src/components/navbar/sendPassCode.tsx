import axios from 'axios';

export const sendPassCode = async (passcode: string) => {
	const url = 'http://localhost:8080/api/auth/turn-on';
	const config = {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	};
	try {
		const res = await axios.post(
			url,
			{
				twoFactorAuthenticationCode: passcode,
			},
			config
		);
		return res;
	} catch (error: any) {
		console.log(error);
	}
};
