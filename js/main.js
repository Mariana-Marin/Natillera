// Entry point
import { Natillera } from './models/Natillera.js';
import { Database } from './services/Database.js';
import { UI } from './ui/UI.js';

class App {
    constructor() {
        this.natillera = new Natillera();
        this.db = new Database();
        this.ui = new UI(this);
    }

    async init() {
        await this.db.initFirebase();
        
        const data = await this.db.loadData();
        
        if (data && data.members) {
            data.members.forEach(m => {
                this.natillera.addMember(m.id, m.name, m.savings || 0, m.history || [], m.loans || []);
            });
            this.natillera.commonFund = data.commonFund || 0;
            this.natillera.generalHistory = data.generalHistory || [];
            this.natillera.updateTotalSavings();
        }

        this.ui.updateView();
    }

    async saveChanges() {
        const snapshot = {
            members: this.natillera.getMembers().map(m => ({ 
                id: m.id, 
                name: m.name, 
                savings: m.savings,
                history: m.history,
                loans: m.loans
            })),
            commonFund: this.natillera.commonFund,
            generalHistory: this.natillera.generalHistory
        };
        await this.db.saveData(snapshot);
        this.ui.updateView();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.init();
});
