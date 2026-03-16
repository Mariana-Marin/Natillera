import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKY1Vt89s8WpexYxAwlUOoH8BVK_jEc3M",
    authDomain: "natillera-1f29b.firebaseapp.com",
    projectId: "natillera-1f29b",
    storageBucket: "natillera-1f29b.firebasestorage.app",
    messagingSenderId: "231580268933",
    appId: "1:231580268933:web:65004110cc3da223b7ecec",
    measurementId: "G-26NH7810T0"
};

export class Database {
    constructor() {
        this.cacheData = null;
        this.db = null;
    }

    async initFirebase() {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        this.db = getFirestore(app);
        console.log("Firebase y Analytics inicializados correctamente");
    }

    async loadData() {
        try {
            // Documento de datos globales en colección 'natilleras'
            const docRef = doc(this.db, "natilleras", "mainData");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Datos cargados desde Firebase de forma exitosa");
                const cloudData = docSnap.data();
                return cloudData;
            } else {
                // No hay datos aún, intentar recuperar los locales de prueba o cargar la estructura inicial y guardarla en la nube
                console.log("No existen datos previos en Firebase, inicializando...");
                
                let initial = this.getDemoData();
                // Ver si ya teníamos en localStorage de la primera versión e importarlos a la nube.
                const localOld = localStorage.getItem("natilleraData");
                if(localOld) {
                    initial = JSON.parse(localOld);
                }

                await this.saveData(initial);
                return initial;
            }
        } catch (error) {
            console.error("Error al cargar datos desde Firebase:", error);
            // Fallback a localStorage si falla el internet o algo
            const localBackup = JSON.parse(localStorage.getItem("natilleraData_backup"));
            if(localBackup) return localBackup;

            return this.getDemoData();
        }
    }

    async saveData(data) {
        try {
            // Guardar en Firestore centralizado
            if(this.db) {
                const docRef = doc(this.db, "natilleras", "mainData");
                await setDoc(docRef, data);
            }
            // Mantenemos un Backup local extra rápido
            localStorage.setItem("natilleraData_backup", JSON.stringify(data));
        } catch (error) {
            console.error("Error al guardar datos en Firebase:", error);
            // Guardar local obligadamente si falla la nube
            localStorage.setItem("natilleraData_backup", JSON.stringify(data));
        }
    }

    getDemoData() {
        const seed = [
            {id: '00', name: 'Piedad', savings: 0},
            {id: '01', name: 'Diana', savings: 0},
            {id: '02', name: 'Jeniffer', savings: 0},
            {id: '03', name: 'Carlos', savings: 0},
            {id: '04', name: 'Luisa', savings: 0},
            {id: '05', name: 'Olga', savings: 0},
            {id: '06', name: 'Gilyer', savings: 0},
            {id: '07', name: 'Katherin', savings: 0},
            {id: '08', name: 'Sara', savings: 0},
            {id: '09', name: 'Laura', savings: 0},
            {id: '10', name: 'Mariana', savings: 0},
            {id: '11', name: 'Cheo', savings: 0},
            {id: '12', name: 'Jean Carlos', savings: 0},
            {id: '13', name: 'Yini', savings: 0},
            {id: '14', name: 'Sofía', savings: 0},
            {id: '15', name: 'Jarvis', savings: 0},
            {id: '16', name: 'Sara (2)', savings: 0},
            {id: '17', name: 'Sebas', savings: 0},
            {id: '18', name: 'Juanes', savings: 0}
        ];

        return {
            members: seed,
            commonFund: 0,
            generalHistory: []
        };
    }
}
