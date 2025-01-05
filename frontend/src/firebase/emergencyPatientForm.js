import { database } from "./initFirebase";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// collection ref
const colRef = collection(database, "emergencyPatient");

//Add Notes
function addNewNote(toSendNoteData, userId, bookingId, setMsg, setIsApiLoading, isSharedNoteType) {
	const { name, age, gender, location } = toSendNoteData;
	if (!userId || !name || !gender || !age || !location) return setMsg("addNewNote: Please Provide all details");
	setIsApiLoading(true);

	const toAdd = {
		userId,
		name,
		gender,
		age,
		bookingId,
		location,
		createdAt: serverTimestamp(),
		updatedOn: serverTimestamp(),
	};
	addDoc(colRef, toAdd)
		.then((e) => {
			if (isSharedNoteType) window.location.href = "/";
		})
		.catch((err) => {
			setMsg(err.code);
			console.log("addNewNote:", err);
		})
		.finally(() => {
			setIsApiLoading(false);
		});
}

// console.log(getAllNotesOfFolder().unsubscribe);

export { addNewNote };
