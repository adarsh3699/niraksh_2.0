import React, { useState, useEffect, memo } from 'react';

import { NavLink } from 'react-router-dom';

import '../styles/homePage.css';

import Disease from '../components/homePage/disease/disease';
import HeroSection from '../components/homePage/heroSection/HeroSection';

import { extractEncryptedToken } from '../utils';

const userLoggedIn = localStorage?.getItem('JWT_token');
const userType = extractEncryptedToken(userLoggedIn)?.type;

function HomePage() {
	return (
		<div id="homePage">
			<HeroSection />
			<Disease />
		</div>
	);
}

export default memo(HomePage);
