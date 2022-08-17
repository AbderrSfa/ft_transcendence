import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import { getUserData } from '../components/getUserData';
import type { AppProps } from 'next/app';
import Router from 'next/router';

import cookie from 'js-cookie';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
	const token = cookie.get('token') as string;
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		if (token) localStorage.setItem('token', token);
		async function fillUserData() {
			const user = await getUserData();
			if (user.statusCode! === 401) Router.push('/login');
			else if (
				!user.profile_done ||
				(user.statusCode! === 477 && Router.pathname !== '/setup')
			)
				Router.push('/setup');
			if (
				(user.statusCode! !== 401 &&
					Router.pathname === '/login' &&
					user.profile_done) ||
				(user.profile_done && Router.pathname === '/setup')
			)
				Router.push('/');
			setUserInfo(user);
		}
		fillUserData();
	}, []);

	return (
		<UserContext.Provider value={{ userInfo, setUserInfo }}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</UserContext.Provider>
	);
}

export default MyApp;
