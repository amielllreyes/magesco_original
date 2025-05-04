import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchProducts = async () => {
  const productsCollection = collection(db, "products");
  const snapshot = await getDocs(productsCollection);
  
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return products;
};
