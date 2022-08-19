import { useEffect, useState } from 'react';
import { faUser, faTag } from '@fortawesome/free-solid-svg-icons';

import { getProfileData } from '../../components/profile/getProfileData';
import ProfileInfoItem from '../../components/profile/profileInfoItem';
import ProfileHeader from '../../components/profile/profileHeader';
import ProfileStats from '../../components/profile/profileStats';
import MatchHistoryButton from '../../components/profile/matchHistoryButton';

const Profile = () => {
	const [profileData, setProfileData]: any = useState({});

	useEffect(() => {
		async function fillProfileData() {
			setProfileData(await getProfileData());
		}
		fillProfileData();
	}, []);

	return (
		<main className='min-h-screen flex flex-col items-center justify-center'>
			{profileData.status === 'success' ? (
				<div className='drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-20'>
					<ProfileHeader profileData={profileData.data} />
					<div className='bg-white px-10 py-4 rounded-b-3xl'>
						<ProfileInfoItem
							icon={faUser}
							field='Full Name'
							info={
								profileData.data.first_name + ' ' + profileData.data.last_name
							}
						/>
						<ProfileInfoItem
							icon={faTag}
							field='Login'
							info={profileData.data.login}
						/>
						<ProfileStats profileStats={profileData.data.profile} />
						<MatchHistoryButton profileStats={profileData.data.profile} />
					</div>
				</div>
			) : null}
		</main>
	);
};

export default Profile;
