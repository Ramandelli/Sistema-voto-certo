
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABfAxoKsk-C4Ym2ph9v0qf3dwiPGgonuo",
  authDomain: "pesquisaeleitoral-45580.firebaseapp.com",
  projectId: "pesquisaeleitoral-45580",
  storageBucket: "pesquisaeleitoral-45580.firebasestorage.app",
  messagingSenderId: "286170851059",
  appId: "1:286170851059:web:5139d2444be9af9ae57986",
  measurementId: "G-Q2QFV65T43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// User types
export interface UserRole {
  isAdmin: boolean;
  isVoter: boolean;
}

// Auth functions
export const registerUser = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", result.user.uid), {
      email,
      role: { isAdmin: false, isVoter: true },
      createdAt: serverTimestamp()
    });
    return result.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const loginAnonymously = async () => {
  return signInAnonymously(auth);
};

export const logoutUser = async () => {
  return signOut(auth);
};

// User functions
export const getUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return { isAdmin: false, isVoter: true };
  } catch (error) {
    console.error("Error getting user role:", error);
    return { isAdmin: false, isVoter: true };
  }
};

// Poll functions
export interface Poll {
  id?: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'active' | 'scheduled' | 'completed';
  candidates: string[];
  createdBy: string;
  createdAt: Timestamp;
}

export const createPoll = async (pollData: Omit<Poll, 'id' | 'createdAt'>) => {
  try {
    const pollRef = await addDoc(collection(db, "polls"), {
      ...pollData,
      createdAt: serverTimestamp()
    });
    return pollRef.id;
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};

export const updatePoll = async (pollId: string, pollData: Partial<Poll>) => {
  try {
    await updateDoc(doc(db, "polls", pollId), {
      ...pollData
    });
    return true;
  } catch (error) {
    console.error("Error updating poll:", error);
    throw error;
  }
};

export const getActivePoll = async () => {
  try {
    const now = new Date();
    const pollsRef = collection(db, "polls");
    const q = query(
      pollsRef,
      where("status", "==", "active"),
      where("startDate", "<=", now),
      where("endDate", ">=", now)
    );
    
    const querySnapshot = await getDocs(q);
    const polls: Poll[] = [];
    
    querySnapshot.forEach((doc) => {
      polls.push({ id: doc.id, ...doc.data() } as Poll);
    });
    
    return polls;
  } catch (error) {
    console.error("Error getting active polls:", error);
    throw error;
  }
};

export const getPoll = async (pollId: string) => {
  try {
    const pollDoc = await getDoc(doc(db, "polls", pollId));
    if (pollDoc.exists()) {
      return { id: pollDoc.id, ...pollDoc.data() } as Poll;
    }
    return null;
  } catch (error) {
    console.error("Error getting poll:", error);
    throw error;
  }
};

export const getAllPolls = async () => {
  try {
    const pollsRef = collection(db, "polls");
    const querySnapshot = await getDocs(pollsRef);
    const polls: Poll[] = [];
    
    querySnapshot.forEach((doc) => {
      polls.push({ id: doc.id, ...doc.data() } as Poll);
    });
    
    return polls;
  } catch (error) {
    console.error("Error getting all polls:", error);
    throw error;
  }
};

// Candidate functions
export interface Candidate {
  id?: string;
  name: string;
  biography: string;
  proposals: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  photoURL: string;
  pollId?: string;
  createdAt: Timestamp;
}

export const createCandidate = async (candidateData: Omit<Candidate, 'id' | 'createdAt'>) => {
  try {
    const candidateRef = await addDoc(collection(db, "candidates"), {
      ...candidateData,
      createdAt: serverTimestamp()
    });
    return candidateRef.id;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};

export const updateCandidate = async (candidateId: string, candidateData: Partial<Candidate>) => {
  try {
    await updateDoc(doc(db, "candidates", candidateId), {
      ...candidateData
    });
    return true;
  } catch (error) {
    console.error("Error updating candidate:", error);
    throw error;
  }
};

export const getCandidate = async (candidateId: string) => {
  try {
    const candidateDoc = await getDoc(doc(db, "candidates", candidateId));
    if (candidateDoc.exists()) {
      return { id: candidateDoc.id, ...candidateDoc.data() } as Candidate;
    }
    return null;
  } catch (error) {
    console.error("Error getting candidate:", error);
    throw error;
  }
};

export const getCandidatesByPoll = async (pollId: string) => {
  try {
    const candidatesRef = collection(db, "candidates");
    const q = query(candidatesRef, where("pollId", "==", pollId));
    const querySnapshot = await getDocs(q);
    const candidates: Candidate[] = [];
    
    querySnapshot.forEach((doc) => {
      candidates.push({ id: doc.id, ...doc.data() } as Candidate);
    });
    
    return candidates;
  } catch (error) {
    console.error("Error getting candidates by poll:", error);
    throw error;
  }
};

// Vote functions
export interface Vote {
  id?: string;
  userId: string;
  pollId: string;
  candidateId: string;
  createdAt: Timestamp;
}

export const castVote = async (voteData: Omit<Vote, 'id' | 'createdAt'>) => {
  try {
    // Check if user already voted in this poll
    const votesRef = collection(db, "votes");
    const q = query(
      votesRef,
      where("userId", "==", voteData.userId),
      where("pollId", "==", voteData.pollId)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("User already voted in this poll");
    }
    
    const voteRef = await addDoc(collection(db, "votes"), {
      ...voteData,
      createdAt: serverTimestamp()
    });
    return voteRef.id;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};

export const getVoteResults = async (pollId: string) => {
  try {
    const votesRef = collection(db, "votes");
    const q = query(votesRef, where("pollId", "==", pollId));
    const querySnapshot = await getDocs(q);
    
    const resultMap: Record<string, number> = {};
    
    querySnapshot.forEach((doc) => {
      const vote = doc.data() as Vote;
      resultMap[vote.candidateId] = (resultMap[vote.candidateId] || 0) + 1;
    });
    
    return resultMap;
  } catch (error) {
    console.error("Error getting vote results:", error);
    throw error;
  }
};

export const hasUserVoted = async (userId: string, pollId: string) => {
  try {
    const votesRef = collection(db, "votes");
    const q = query(
      votesRef, 
      where("userId", "==", userId),
      where("pollId", "==", pollId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if user voted:", error);
    throw error;
  }
};

// File upload functions
export const uploadCandidatePhoto = async (file: File, candidateId: string) => {
  try {
    const storageRef = ref(storage, `candidate-photos/${candidateId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading candidate photo:", error);
    throw error;
  }
};

export { auth, db, storage };
