import { useEffect, useState } from 'react';
import { getData } from '../getData';

const FriendRequests = () => {
	const [friendRequests, setFriendRequests] :any = useState();

	useEffect(() => {
		async function fillData() {
			setFriendRequests(
				await getData('http://localhost:8080/api/friends/request')
			);
		}
		fillData();
	}, []);

	console.log(friendRequests);

	return (
		<>
			{friendRequests
				? friendRequests.data.map((request :any, id: number) => {
						const user = request.to;
						return (
							<div key={id} className='mt-4 flex items-center'>
								<img
									src={user.image_url}
									alt='User Avatar'
									className='w-16 h-16 object-cover rounded-full'
								/>
								<div className='ml-4'>
									<h4 className='text-xl font-medium mb-2'>{user.user_name}</h4>
									<button className='bg-sky-800 text-white font-medium rounded-3xl py-2 px-4 mr-2'>
										Accept
									</button>
									<button className='bg-sky-800 text-white font-medium rounded-3xl py-2 px-4 mr-2'>
										Decline
									</button>
								</div>
							</div>
						);
				  })
				: null}
		</>
	);
};

export default FriendRequests;
