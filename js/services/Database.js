// Aquí deberías inicializar Firebase.
// Importaciones placeholder
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

export class Database {
    constructor() {
        this.cacheData = null;
        this.initDemoData();
    }

    async initFirebase() {
        // TODO: Copia y pega tu configuración de Firebase aquí
        /*
        const firebaseConfig = {
            apiKey: "AIzaSy...",
            authDomain: "tu-proyecto.firebaseapp.com",
            projectId: "tu-proyecto",
            storageBucket: "tu-proyecto.appspot.com",
            messagingSenderId: "123456789",
            appId: "1:..."
        };
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
        */
        console.log("Firebase placeholder initialized");
    }

    initDemoData() {
        // Datos iniciales en localStorage para pruebas
        if(!localStorage.getItem("natilleraData")) {
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
            
            const initialData = {
                members: seed,
                commonFund: 0
            };
            
            this.saveData(initialData);
        }
    }

    async loadData() {
        return JSON.parse(localStorage.getItem("natilleraData"));
    }

    async saveData(data) {
        localStorage.setItem("natilleraData", JSON.stringify(data));
    }
}