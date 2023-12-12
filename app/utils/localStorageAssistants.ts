import { StoredAssistant } from "@/app/components/AssistantList";

export const saveAssistantsToLocalStorage = ({ assistantName, assistantDescription, assistantId, threadId }: StoredAssistant): void => {
    const storedAssistants = window.localStorage.getItem("storedAssistants");
    const newAssistant = { assistantName, assistantDescription, assistantId, threadId };

    if (storedAssistants === null) {
        localStorage.setItem("storedAssistants", JSON.stringify([newAssistant]));
    } else {
        const loadedStoredAssistants: Array<StoredAssistant> = JSON.parse(storedAssistants);

        // Check if the specific StoredAssistant already exists
        const existingAssistant = loadedStoredAssistants.find(a => a.assistantId === assistantId);

        if (!existingAssistant) {
            const joinedAssistantsArray = [...loadedStoredAssistants, newAssistant];
            window.localStorage.setItem("storedAssistants", JSON.stringify(joinedAssistantsArray));
        }
    }
}

export const addAssistantThreadToLocalStorage = (assistantId: string, threadId: string): void => {
    const storedAssistants = window.localStorage.getItem("storedAssistants");
    if (storedAssistants) {
        let loadedStoredAssistants: Array<StoredAssistant> = JSON.parse(storedAssistants);

        // Find the index of the assistant to be cleared
        const index = loadedStoredAssistants.findIndex(a => a.assistantId === assistantId);
        if (index !== -1) {
            // Clear the threadId property of the specified assistant
            loadedStoredAssistants[index].threadId = threadId;
            console.log(loadedStoredAssistants)

            // Save the updated assistants array back to Local Storage
            window.localStorage.setItem("storedAssistants", JSON.stringify(loadedStoredAssistants));
        }
    }
}

export const getNumberOfSavedAssistants = () => {
    const storedAssistants = localStorage.getItem("storedAssistants");
    if (storedAssistants === null) return 0
    return JSON.parse(storedAssistants).length
}

export const fetchAssistantsFromLocalStorage = (): Array<StoredAssistant> => {
    const storedAssistants = window.localStorage.getItem("storedAssistants");
    let assistants;

    if (storedAssistants) {
        assistants = JSON.parse(storedAssistants);
    } else {
        assistants = [];
    }
    console.log(assistants)
    return assistants;
}

export const fetchAssistantThreadsFromLocalStorage = async(allSavedAssistants: any) => {
  // Fetch assistants from localStorage
  const localStorageAssistantsJson = localStorage.getItem('storedAssistants');
  const localStorageAssistants = localStorageAssistantsJson ? JSON.parse(localStorageAssistantsJson) : [];

  // Fetch assistants from the API (this is a placeholder for your actual API call)
console.log(localStorageAssistants)
console.log("local storage above")
    
    // Reconcile threadIds from localStorage with the assistants from the API
    const reconciledAssistants = allSavedAssistants.map((savedAssistant) => {
  
      const localStorageAssistant = localStorageAssistants.find((localStorageAssistant) => localStorageAssistant.assistantId === savedAssistant.id);
      if (localStorageAssistant) {
        // If found in localStorage, add the threadId to the assistant from the API
        return {
          ...savedAssistant,
          threadId: localStorageAssistant.threadId
        };
      }
      return savedAssistant;
    });
    console.log("below")
    console.log(reconciledAssistants)
    // Update the state with the reconciled assistants
   return reconciledAssistants;
}

export const clearAssistantThreadFromLocalStorage = (assistantId: string): void => {
    const storedAssistants = window.localStorage.getItem("storedAssistants");
    if (storedAssistants) {
        let loadedStoredAssistants: Array<StoredAssistant> = JSON.parse(storedAssistants);

        // Find the index of the assistant to be cleared
        const index = loadedStoredAssistants.findIndex(a => a.assistantId === assistantId);
        if (index !== -1) {
            // Clear the threadId property of the specified assistant
            loadedStoredAssistants[index].threadId = null;
            console.log(loadedStoredAssistants)

            // Save the updated assistants array back to Local Storage
            window.localStorage.setItem("storedAssistants", JSON.stringify(loadedStoredAssistants));
        }
    }
}

