export class Member {
    constructor(id, name, savings = 0, history = [], loans = []) {
        this.id = id;
        this.name = name;
        this.savings = savings;
        this.history = history; 
        /* history items: { date, amount, desc, type: 'ahorro'|'prestamo'|'abono'|'interes'|'actividad' } */
        this.loans = loans; 
        /* loans items: { id: timestamp, date, amount, remaining, interestPaid } */
    }

    addHistory(date, amount, desc, type) {
        this.history.unshift({ id: Date.now() + Math.random(), date, amount, desc, type });
    }


    addSavings(amount, date = new Date().toISOString().split("T")[0]) {
        if(amount > 0) {
            this.savings += amount;
            this.addHistory(date, amount, 'Aporte a Ahorro Quincenal', 'ahorro');
        }
    }

    addLoan(amount, date = new Date().toISOString().split("T")[0]) {
        this.loans.push({
            id: Date.now(),
            date: date,
            amount: amount,
            remaining: amount,
            interestPaid: 0
        });
        this.addHistory(date, amount, `Préstamo Adquirido`, 'prestamo');
    }

    payLoanCapital(amount, date = new Date().toISOString().split("T")[0]) {
        let activeLoan = this.loans.find(l => l.remaining > 0);
        if (activeLoan && amount > 0) {
            activeLoan.remaining = Math.max(0, activeLoan.remaining - amount);
            this.addHistory(date, amount, `Abono a capital prestado`, 'abono');
        }
    }

    payInterest(amount, date = new Date().toISOString().split("T")[0]) {
        let activeLoan = this.loans.find(l => l.remaining > 0) || this.loans[this.loans.length - 1];
        if (activeLoan && amount > 0) {
            activeLoan.interestPaid += amount;
            this.addHistory(date, amount, `Pago de Intereses`, 'interes');
        }
    }

    recordActivityParticipation(activityName, date) {
        this.addHistory(date, 0, `Participó en: ${activityName}`, 'actividad');
    }

    editHistoryEventByIndex(itemIdx, newAmount, newDesc, newDate) {
        if(itemIdx < 0 || itemIdx >= this.history.length) return false;

        const item = this.history[itemIdx];
        const diff = newAmount - item.amount;

        // Ajustar balances según el tipo
        if(item.type === 'ahorro') {
            this.savings += diff;
        } else if(item.type === 'prestamo') {
            let activeLoan = this.loans.find(l => l.amount === item.amount) || this.loans[this.loans.length - 1];
            if(activeLoan) {
                activeLoan.amount += diff;
                activeLoan.remaining += diff;
            }
        } else if(item.type === 'abono') {
            let activeLoan = this.loans.find(l => l.remaining < l.amount) || this.loans[this.loans.length - 1];
            if(activeLoan) activeLoan.remaining = Math.max(0, activeLoan.remaining - diff);
        } else if(item.type === 'interes') {
            let activeLoan = this.loans.find(l => l.interestPaid >= item.amount) || this.loans[this.loans.length - 1];
            if(activeLoan) activeLoan.interestPaid += diff;
        }

        item.amount = newAmount;
        if(newDesc) item.desc = newDesc;
        if(newDate) item.date = newDate;
        return true;
    }

undoHistoryEventByIndex(itemIdx) {
        if(itemIdx < 0 || itemIdx >= this.history.length) return null;
        
        const item = this.history[itemIdx];
        
        // Revertir efecto en el integrante según el tipo
        if(item.type === 'ahorro') {
            this.savings -= item.amount;
        } else if(item.type === 'prestamo') {
            // Eliminar último préstamo registrado coincidente o reajustar (lógica simplificada: eliminamos el préstamo total si coincide)
            if(this.loans.length > 0) this.loans.pop();
        } else if(item.type === 'abono') {
            let activeLoan = this.loans.find(l => l.remaining < l.amount) || this.loans[this.loans.length - 1];
            if(activeLoan) activeLoan.remaining += item.amount;
        } else if(item.type === 'interes') {
            let activeLoan = this.loans.find(l => l.interestPaid > 0) || this.loans[this.loans.length - 1];
            if(activeLoan) activeLoan.interestPaid -= item.amount;
        }

        // Eliminar del historial
        this.history.splice(itemIdx, 1);
        return item; // Para poder revertir fondos globales si aplica
    }


    getTotal(sharedEarnings) {
        return this.savings + sharedEarnings;
    }
}

