import { useState, memo } from "react";

const MedicineSearch = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	const handleSearch = async () => {
		// Add your search logic here
		// Example: Fetch data from an API
		const response = await fetch(`https://api.example.com/medicines?query=${query}`);
		const data = await response.json();
		setResults(data);
	};

	return (
		<div>
			<h1>Medicine Search</h1>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search for a medicine"
			/>
			<button onClick={handleSearch}>Search</button>
			<ul>
				{results.map((result, index) => (
					<li key={index}>{result.name}</li>
				))}
			</ul>
		</div>
	);
};

export default memo(MedicineSearch);
