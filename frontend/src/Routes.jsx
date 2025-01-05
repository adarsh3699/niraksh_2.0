import { memo, Suspense, lazy, useEffect } from 'react';
import { DNA } from 'react-loader-spinner';
import { Navigate, useLocation, Routes as Switch, Route } from 'react-router-dom';

import NavBar from './components/navBar/NavBar';

//lazy loading split the main bundle into many chunks
const HomePage = lazy(() => import('./pages/HomePage'));
const HospitalLogin = lazy(() => import('./pages/HospitalLogin'));
const HospitalRegPage = lazy(() => import('./pages/HospitalRegPage'));
const HospitalDashboard = lazy(() => import('./pages/HospitalDashboard'));
const HospitalSearch = lazy(() => import('./pages/HospitalSearch'));
const PatientPortal = lazy(() => import('./pages/PatientPortal'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserSignup = lazy(() => import('./pages/UserSignup'));
const UserForgetPass = lazy(() => import('./pages/UserForgetPass'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const UserEmergencyForm = lazy(() => import('./pages/UserEmergencyForm'));
const OPDappointment = lazy(() => import('./pages/OPDappointment'));

function Routes() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<Suspense
			fallback={
				<div id="loadingScreen">
					<div>Loading...</div>
					<DNA
						visible={true}
						height="180"
						width="180"
						ariaLabel="dna-loading"
						wrapperStyle={{}}
						wrapperClass="dna-wrapper"
					/>
				</div>
			}
		>
			<Switch>
				<Route
					exact
					path="/"
					element={
						<>
							<NavBar />
							<HomePage />
						</>
					}
				/>
				<Route exact path="/home" element={<Navigate to="/" />} />
				<Route
					exact
					path="/hospital-login"
					element={
						<>
							<NavBar />
							<HospitalLogin />
						</>
					}
				/>
				<Route
					exact
					path="/hospital-registration"
					element={
						<>
							<NavBar />
							<HospitalRegPage />
						</>
					}
				/>
				<Route
					exact
					path="/hospital-dashboard"
					element={
						<>
							<NavBar />
							<HospitalDashboard />
						</>
					}
				/>
				<Route
					exact
					path="/hospital-search"
					element={
						<>
							<NavBar />
							<HospitalSearch />
						</>
					}
				/>
				<Route
					exact
					path="/user-dashboard"
					element={
						<>
							<NavBar />
							<PatientPortal />
						</>
					}
				/>
				<Route
					exact
					path="/opd-appointment"
					element={
						<>
							<NavBar />
							<OPDappointment />
						</>
					}
				/>
				<Route
					exact
					path="/login"
					element={
						<>
							<NavBar />
							<UserLogin />
						</>
					}
				/>
				<Route
					exact
					path="/register"
					element={
						<>
							<NavBar />
							<UserSignup />
						</>
					}
				/>
				<Route
					exact
					path="/forgot-password"
					element={
						<>
							<NavBar />
							<UserForgetPass />
						</>
					}
				/>

				<Route
					exact
					path="/about"
					element={
						<>
							<NavBar />
							<AboutUs />
						</>
					}
				/>
				<Route
					exact
					path="/contact"
					element={
						<>
							<NavBar />
							<ContactUs />
						</>
					}
				/>

				<Route
					exact
					path="/emergency-form"
					element={
						<>
							<NavBar />
							<UserEmergencyForm />
						</>
					}
				/>

				<Route
					path="*"
					element={
						<center id="pageNotFound">
							<h1>Sorry, this page isn&apos;t available.</h1>
							<h2>Error: 404</h2>
							<a href="/login"> Go to Login Page</a>
						</center>
					}
				/>
			</Switch>
		</Suspense>
	);
}

export default memo(Routes);
