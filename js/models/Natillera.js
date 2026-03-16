import { Member } from './Member.js';

export class Natillera {
    constructor() {
        this.members = [];
        this.commonFund = 0; 
        this.totalSavings = 0; 
        this.generalHistory = []; 
        /* generalHistory items: { date, amount, desc, type: 'polla'|'fondo_interes'|'fondo_actividad' } */
    }

    addMember(id, name, savings = 0, history = [], loans = []) {
        const newMember = new Member(id, name, savings, history, loans);
        this.members.push(newMember);
        this.updateTotalSavings();
    }

    getMembers() { return this.members; }
    getMember(id) { return this.members.find(m => m.id === id); }

    updateTotalSavings() {
        this.totalSavings = this.members.reduce((acc, m) => acc + m.savings, 0);
    }

    addActivityEarnings(name, date, participantIds, amount) {
        if (amount > 0) {
            this.commonFund += amount;
            this.logGlobalEvent(`Fondo suma por Actividad: ${name}`, amount, date, 'fondo_actividad');
            // Loguear participación individual
            participantIds.forEach(id => {
                let m = this.getMember(id);
                if(m) m.recordActivityParticipation(name, date);
            });
        }
    }

    registerPolla(date, hasWinner, winnerNumber = null) {
        let amount = hasWinner ? 90000 : 180000;
        this.commonFund += amount;
        let msg = hasWinner 
            ? `Polla Mensual - Ganador #${winnerNumber}` 
            : 'Polla Mensual - Sin ganador (100% al fondo)';

        this.logGlobalEvent(msg, amount, date, 'polla');
    }

    // -- Nueva Gestión de Préstamos centralizada --
    processLoan(memberId, amount, date) {
        let m = this.getMember(id => id === memberId);
        if(!m) m = this.getMember(memberId);
        if (m && amount > 0) m.addLoan(amount, date);
    }

    processLoanPayment(memberId, capitalAmount, interestAmount, date) {
        let m = this.getMember(memberId);
        if(!m) return;
        
        if(capitalAmount > 0) {
            m.payLoanCapital(capitalAmount, date);
        }
        
        if(interestAmount > 0) {
            m.payInterest(interestAmount, date);
            this.commonFund += interestAmount;
            this.logGlobalEvent(`Ingreso Intereses de ${m.name}`, interestAmount, date, 'fondo_interes');
        }
    }

    undoGlobalEvent() {
        if(this.generalHistory.length === 0) return null;
        
        // Quitar el último evento global que se hizo (primer elemento en el array shiftado)
        const item = this.generalHistory.shift();
        
        // Revertir efecto en el fondo
        if(item.type === 'polla' || item.type === 'fondo_actividad' || item.type === 'fondo_interes') {
            this.commonFund -= item.amount;
        }

        // Importante: Si se deshace una actividad, idealmente habría que buscar y deshacer la participación
        // en los historiales individuales. Por simplicidad de este nivel, sólo revertimos el fondo común y global.
        return item;
    }

    deleteMember(id) {
        const memIdx = this.members.findIndex(m => m.id === id);
        if(memIdx !== -1) {
            // Elimigamos el miembro, y la actualización re-calculará todo
            this.members.splice(memIdx, 1);
            this.updateTotalSavings();
            return true;
        }
        return false;
    }

    undoMemberEvent(memberId, index) {
        const m = this.getMember(memberId);
        if(m) {
            const item = m.undoHistoryEventByIndex(index);
            if(item) {
                // Si el evento revertido era un pago de intereses, también debemos sacarlo del fondo total.
                if(item.type === 'interes') {
                    this.commonFund -= item.amount;
                }
                this.updateTotalSavings();
                return true;
            }
        }
        return false;
    }

    logGlobalEvent(desc, amount, date, type) {
        this.generalHistory.unshift({ id: Date.now() + Math.random(), date, amount, desc, type });
    }


    getEarningsPerMember() {
        if(this.members.length === 0) return 0;
        return this.commonFund / this.members.length;
    }

    getCommonFundBreakdown() {
        let breakdown = { actividades: 0, polla: 0, intereses: 0 };
        this.generalHistory.forEach(h => {
            if(h.type === 'fondo_actividad') breakdown.actividades += h.amount;
            if(h.type === 'polla') breakdown.polla += h.amount;
            if(h.type === 'fondo_interes') breakdown.intereses += h.amount;
        });
        return breakdown;
    }

    getAllHistory() {
        let all = [...this.generalHistory];
        this.members.forEach(m => {
            m.history.forEach(h => {
                all.push({ ...h, memberName: m.name });
            });
        });
        return all.sort((a,b) => new Date(b.date) - new Date(a.date));
    }
}

