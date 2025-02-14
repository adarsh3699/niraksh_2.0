import React from 'react';
import "../styles/drugDrugInteraction.css";


const DrugDrugInteraction = () => {
    return (
        <div id="drugDrugInteraction">
            {/* <h1>Drug-Drug Interaction Page</h1> */}
            <div class="container">
                <h1>Drug Interaction Checker</h1>
                <form id="interactionForm" />
                <div id="medicationInputs">
                    <div class="medication-input">
                        <input type="text" placeholder="Medication Name" required />
                        <input type="file" accept="image/*" />
                    </div>
                </div>
                <div class="button-container">
                    <button type="button" id="addMedication">Add Another Medication</button>
                    <button type="submit">Check Interactions</button>
                </div>
            </div>

            {/* Add your content here */}
        </div>
    );
};

export default DrugDrugInteraction;