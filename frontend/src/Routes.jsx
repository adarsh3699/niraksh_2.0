import { memo, Suspense, lazy, useEffect } from 'react';
import { DNA } from 'react-loader-spinner';
import { Navigate, useLocation, Routes as Switch, Route } from 'react-router-dom';

import NavBar from './components/navBar/NavBar';

//lazy loading split the main bundle into many chunks
const HomePage = lazy(() => import('./pages/HomePage'));
const PrescriptionExplainer = lazy(() => import('./pages/PrescriptionExplainer'));
const MedicineSearch = lazy(() => import('./pages/MedicineSearch'));
const DiseaseSearch = lazy(() => import('./pages/DiseaseSearch'));
const DrugDrugInteraction = lazy(() => import('./pages/DrugDrugInteraction'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserSignup = lazy(() => import('./pages/UserSignup'));
const UserForgetPass = lazy(() => import('./pages/UserForgetPass'));
const DoctorSuggest = lazy(() => import('./pages/DoctorSuggest'));
const AboutUs = lazy(() => import('./pages/AboutUs'));

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
					path="/prescription_explainer"
					element={
						<>
							<NavBar />
							<PrescriptionExplainer />
						</>
					}
				/>

				<Route
					exact
					path="/medicine_search"
					element={
						<>
							<NavBar />
							<MedicineSearch />
						</>
					}
				/>

				<Route
					exact
					path="/drug_drug_interaction"
					element={
						<>
							<NavBar />
							<DrugDrugInteraction />
						</>
					}
				/>

				<Route
					exact
					path="/diseases"
					element={
						<>
							<NavBar />
							<DiseaseSearch />
						</>
					}
				/>

				<Route
					exact
					path="/doctor_suggest"
					element={
						<>
							<NavBar />
							<DoctorSuggest />
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
