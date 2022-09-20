import axios from 'axios';
export const addFriend = async (intra_id: number) => {
	const url = 'http://localhost:8080/api/friends/request';
	const config = {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	};
	const res = await axios.post(
		url,
		{
			to: intra_id,
		},
		config
	);
	return res;
};
