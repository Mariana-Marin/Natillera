// Maneja el DOM
export class UI {
    constructor(appInstance) {
        this.app = appInstance;
        this.cacheDOM();
        this.bindEvents();
        this.checkAdminSession();
    }

    cacheDOM() {
        this.publicDashboard = document.getElementById("publicDashboard");
        this.adminDashboard = document.getElementById("adminDashboard");
        this.adminModal = document.getElementById("adminModal");

        this.adminLoginBtn = document.getElementById("adminLoginBtn");
        this.adminLogoutBtn = document.getElementById("adminLogoutBtn");
        this.backHomeBtn = document.getElementById("backHomeBtn");
        this.adminPanelBtn = document.getElementById("adminPanelBtn");
        
        this.loginConfirmBtn = document.getElementById("loginConfirmBtn");
        this.loginCancelBtn = document.getElementById("loginCancelBtn");
        this.adminPassword = document.getElementById("adminPassword");
        
        this.totalSavingsEl = document.getElementById("totalSavings");
        this.totalEarningsEl = document.getElementById("totalEarnings");
        this.earningsPerMemberEl = document.getElementById("earningsPerMember");
        
        this.memberSelect = document.getElementById("memberSelect");
        this.personalSummary = document.getElementById("personalSummary");
        this.pNumber = document.getElementById("pNumber");
        this.pSavings = document.getElementById("pSavings");
        this.pTotal = document.getElementById("pTotal");
        this.personalHistoryList = document.getElementById("personalHistoryList");

        this.membersTableBody = document.getElementById("membersTableBody");
        this.historyList = document.getElementById("historyList");
        
        // Forms
        this.formGlobalEarnings = document.getElementById("globalEarningsForm");
        this.formPolla = document.getElementById("pollaForm");
        
        this.formLoan = document.getElementById("loanForm");
        this.formLoanPayment = document.getElementById("loanPaymentForm");
        
        // Fields Date Defaults
        document.getElementById("pollaDate").valueAsDate = new Date();
        document.getElementById("activityDate").valueAsDate = new Date();
        document.getElementById("loanDate").valueAsDate = new Date();
        document.getElementById("paymentDate").valueAsDate = new Date();

        // Fields Polla
        this.pollaWinnerType = document.getElementById("pollaWinnerType");
        this.pollaWinnerNumberContainer = document.getElementById("pollaWinnerNumberContainer");
        this.pollaWinnerNumber = document.getElementById("pollaWinnerNumber");

        // Fields Activities
        this.activityMembersContainer = document.getElementById("activityMembersContainer");
        
        // Fields Loans
        this.loanMember = document.getElementById("loanMember");
        this.paymentMember = document.getElementById("paymentMember");

        // Stat Boxes y Modal Detalles
        this.boxTotalSavings = document.getElementById("boxTotalSavings");
        this.boxTotalEarnings = document.getElementById("boxTotalEarnings");
        this.boxEarningsPerMember = document.getElementById("boxEarningsPerMember");

        this.detailModal = document.getElementById("detailModal");
        this.detailModalTitle = document.getElementById("detailModalTitle");
        this.detailModalBody = document.getElementById("detailModalBody");
        this.detailModalCloseBtn = document.getElementById("detailModalCloseBtn");

        // Elementos Modales de Gestión
        this.memberManageModal = document.getElementById("memberManageModal");
        this.manageMemberName = document.getElementById("manageMemberName");
        this.manageHistoryList = document.getElementById("manageHistoryList");
        this.closeManageModalBtn = document.getElementById("closeManageModalBtn");
        this.deleteMemberActionBtn = document.getElementById("deleteMemberActionBtn");
        
        // Nuevo Integrante Btn
        this.addMemberBtn = document.getElementById("addMemberBtn");
    }

    bindEvents() {
        // Modal Detalle Stats
        this.detailModalCloseBtn.addEventListener("click", () => this.detailModal.classList.add("hidden"));

        this.boxTotalSavings.addEventListener("click", () => {
            const mems = this.app.natillera.getMembers();
            this.detailModalTitle.textContent = "Desglose: Fondo de Ahorro";
            let html = '<ul class="detail-list">';
            mems.forEach(m => {
                html += `<li><span>👤 ${m.name}</span> <strong>${this.formatMoney(m.savings)}</strong></li>`;
            });
            html += `</ul>`;
            html += `<div style="text-align:right; margin-top:1.5rem;">
                        <span style="color:#7f8c8d; font-size:0.9rem;">Total Reuniendo:</span><br>
                        <strong style="color:var(--primary); font-size:1.5rem;">${this.formatMoney(this.app.natillera.totalSavings)}</strong>
                     </div>`;
            this.detailModalBody.innerHTML = html;
            this.detailModal.classList.remove("hidden");
        });

        this.boxTotalEarnings.addEventListener("click", () => {
            const breakdown = this.app.natillera.getCommonFundBreakdown();
            this.detailModalTitle.textContent = "Desglose: Ganancias Comunes";
            let html = '<ul class="detail-list">';
            html += `<li><span>🎉 Actividades Mensuales</span> <strong style="color:#3498db">${this.formatMoney(breakdown.actividades)}</strong></li>`;
            html += `<li><span>🎱 La Polla</span> <strong style="color:#9b59b6">${this.formatMoney(breakdown.polla)}</strong></li>`;
            html += `<li><span>🔁 Pago de Intereses</span> <strong style="color:#d35400">${this.formatMoney(breakdown.intereses)}</strong></li>`;
            html += `</ul>`;
            html += `<div style="text-align:right; margin-top:1.5rem;">
                        <span style="color:#7f8c8d; font-size:0.9rem;">Total Generado:</span><br>
                        <strong style="color:var(--primary); font-size:1.5rem;">${this.formatMoney(this.app.natillera.commonFund)}</strong>
                     </div>`;
            this.detailModalBody.innerHTML = html;
            this.detailModal.classList.remove("hidden");
        });

        this.boxEarningsPerMember.addEventListener("click", () => {
             const fund = this.app.natillera.commonFund;
             const memsCount = this.app.natillera.getMembers().length;
             const amount = this.app.natillera.getEarningsPerMember();
             
             this.detailModalTitle.textContent = "Distribución por Integrante";
             this.detailModalBody.innerHTML = `
                 <div style="background:#f0f8ff; padding:1.5rem; border-radius:8px; text-align:center;">
                     <h2 style="color:var(--primary); font-size:2.5rem; margin-bottom:1rem; letter-spacing:-1px;">${this.formatMoney(amount)}</h2>
                     <p style="color:var(--text-light); font-size:0.95rem; line-height:1.4;">Este valor se calcula dividiendo matemáticamente y en partes iguales el <strong>Fondo de Ganancias Comunes</strong> entre todos los Integrantes activos.</p>
                     
                     <div style="margin-top:1.5rem; font-family:monospace; background:white; padding:1rem; border:1px dashed #ccc; border-radius:6px; font-size:0.9rem;">
                        <span style="color:#27ae60">${this.formatMoney(fund)}</span>
                        <br>÷<br>
                        <span style="color:#2980b9">${memsCount} integrantes</span> 
                        <hr style="margin:0.5rem 0; border:0; border-top:1px solid #eee;">
                        <strong>= ${this.formatMoney(amount)}</strong>
                     </div>
                 </div>
             `;
             this.detailModal.classList.remove("hidden");
        });

        this.adminLoginBtn.addEventListener("click", () => this.adminModal.classList.remove("hidden"));

        // --- EVENTOS DESHACER Y ELIMINAR ---
        if(this.closeManageModalBtn) {
            this.closeManageModalBtn.addEventListener('click', () => {
                this.memberManageModal.classList.add("hidden");
            });
        }

        if(this.deleteMemberActionBtn) {
            this.deleteMemberActionBtn.addEventListener('click', () => {
                if(confirm(" ADVERTENCIA CRÍTICA: ¿Estás completamente seguro de borrar este integrante y destruir su dinero ahorrado del fondo? Esto no se puede deshacer.")) {
                    this.app.natillera.deleteMember(this.currentManageMemberId);
                    this.app.saveChanges();
                    this.memberManageModal.classList.add("hidden");
                    alert("Integrante y caja de ahorro eliminada con éxito.");
                    this.updateView();
                }
            });
        }

        if(this.addMemberBtn) {
            this.addMemberBtn.addEventListener('click', () => {
                const name = prompt("Escribe el nombre del nuevo integrante:");
                if(name && name.trim()) {
                    // Generar un ID básico basado en los miembros actuales
                    const membersCount = this.app.natillera.getMembers().length;
                    const newId = (membersCount + 1).toString();
                    
                    this.app.natillera.addMember(newId, name.trim());
                    this.app.saveChanges();
                    alert(`¡Integrante "${name.trim()}" agregado exitosamente!`);
                    this.updateView();
                }
            });
        }

        this.loginCancelBtn.addEventListener("click", () => this.adminModal.classList.add("hidden"));
        
        this.loginConfirmBtn.addEventListener("click", () => {
            if (this.adminPassword.value === "admin123") {
                this.adminModal.classList.add("hidden");
                this.adminPassword.value = '';
                localStorage.setItem("natilleraAdminAuth", "true");
                this.toggleAdmin(true);
            } else {
                alert("Contraseña incorrecta");
            }
        });

        this.adminLogoutBtn.addEventListener("click", () => {
            localStorage.removeItem("natilleraAdminAuth");
            this.toggleAdmin(false);
            this.toggleBackToPanel(false);
        });

        // Alternar vistas si ya es admin
        this.backHomeBtn.addEventListener("click", () => {
            this.toggleAdmin(false);
            this.toggleBackToPanel(true);
        });

        this.adminPanelBtn.addEventListener("click", () => {
            if(localStorage.getItem("natilleraAdminAuth") === "true") {
                this.toggleAdmin(true);
            }
        });

        this.memberSelect.addEventListener("change", (e) => {
            const memberId = e.target.value;
            if (memberId) this.renderPersonalSummary(memberId);
            else this.personalSummary.classList.add("hidden");
        });

        // Toggle Polla
        this.pollaWinnerType.addEventListener("change", (e) => {
            if(e.target.value === 'yes') {
                this.pollaWinnerNumberContainer.classList.remove('hidden');
            } else {
                this.pollaWinnerNumberContainer.classList.add('hidden');
            }
        });

        // Actividades form
        this.formGlobalEarnings.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("activityName").value;
            const actDate = document.getElementById("activityDate").value;
            const inc = parseInt(document.getElementById("activityIncome").value) || 0;
            
            const checkboxes = this.activityMembersContainer.querySelectorAll("input[type='checkbox']:checked");
            const selectedIds = Array.from(checkboxes).map(cb => cb.value);
            
            this.app.natillera.addActivityEarnings(name, actDate, selectedIds, inc);
            this.app.saveChanges();
            
            e.target.reset();
            document.getElementById("activityDate").valueAsDate = new Date();
            alert("Actividad registrada con éxito!");
            this.updateView();
        });

        // Polla form
        this.formPolla.addEventListener("submit", (e) => {
            e.preventDefault();
            const pDate = document.getElementById("pollaDate").value;
            const hasWinner = this.pollaWinnerType.value === "yes";
            const wNum = this.pollaWinnerNumber.value;
            this.app.natillera.registerPolla(pDate, hasWinner, wNum);
            this.app.saveChanges();
            alert("Polla registrada!");
            this.updateView();
        });

        // Préstamo nuevo form
        this.formLoan.addEventListener("submit", (e) => {
            e.preventDefault();
            const memberId = this.loanMember.value;
            const lDate = document.getElementById("loanDate").value;
            const loanAmt = parseInt(document.getElementById("loanAmount").value) || 0;

            if(!memberId) return alert("Selecciona integrante");
            if(loanAmt > 0) {
                this.app.natillera.processLoan(memberId, loanAmt, lDate);
                this.app.saveChanges();
                e.target.reset();
                document.getElementById("loanDate").valueAsDate = new Date();
                alert("Préstamo otorgado correctamente.");
                this.updateView();
            }
        });

        // Abonos a préstamo e intereses form
        this.formLoanPayment.addEventListener("submit", (e) => {
            e.preventDefault();
            const memberId = this.paymentMember.value;
            const pDate = document.getElementById("paymentDate").value;
            const capAmt = parseInt(document.getElementById("paymentCapital").value) || 0;
            const intAmt = parseInt(document.getElementById("paymentInterest").value) || 0;

            if(!memberId) return alert("Selecciona integrante");
            if(capAmt > 0 || intAmt > 0) {
                this.app.natillera.processLoanPayment(memberId, capAmt, intAmt, pDate);
                this.app.saveChanges();
                e.target.reset();
                document.getElementById("paymentDate").valueAsDate = new Date();
                alert("Pagos procesados y guardados.");
                this.updateView();
            } else {
                alert("Debes ingresar al menos un valor de capital o interés.");
            }
        });
    }

    checkAdminSession() {
        if(localStorage.getItem("natilleraAdminAuth") === "true") {
            this.toggleBackToPanel(true);
            this.adminLoginBtn.classList.add("hidden");
            this.adminLogoutBtn.classList.remove("hidden");
        }
    }

    toggleAdmin(isAdmin) {
        if (isAdmin) {
            this.publicDashboard.classList.add("hidden");
            this.adminDashboard.classList.remove("hidden");
            this.adminLoginBtn.classList.add("hidden");
            this.adminLogoutBtn.classList.remove("hidden");
            this.backHomeBtn.classList.remove("hidden");
            this.adminPanelBtn.classList.add("hidden");
            this.updateView(); 
        } else {
            this.publicDashboard.classList.remove("hidden");
            this.adminDashboard.classList.add("hidden");
            this.backHomeBtn.classList.add("hidden");
            if(localStorage.getItem("natilleraAdminAuth") === "true") {
                this.adminPanelBtn.classList.remove("hidden");
            } else {
                this.adminLoginBtn.classList.remove("hidden");
                this.adminLogoutBtn.classList.add("hidden");
            }
            this.memberSelect.value = '';
            this.personalSummary.classList.add("hidden");
            this.updateView();
        }
    }

    toggleBackToPanel(show) {
        if(show && this.adminDashboard.classList.contains("hidden")) {
            this.adminPanelBtn.classList.remove("hidden");
        } else {
            this.adminPanelBtn.classList.add("hidden");
        }
    }

    renderDropdowns(members) {
        const options = members.map(m => `<option value="${m.id}">${m.id} - ${m.name}</option>`).join('');
        
        // Checklist para actividades
        this.activityMembersContainer.innerHTML = members.map(m => `
            <label class="cl-item"><input type="checkbox" value="${m.id}"> ${m.name}</label>
        `).join('');

        this.loanMember.innerHTML = `<option value="">Seleccione a quién dar préstamo...</option>` + options;
        this.paymentMember.innerHTML = `<option value="">Seleccione quién abona...</option>` + options;
        
        const currSel = this.memberSelect.value;
        this.memberSelect.innerHTML = '<option value=""> Selecciona tu nombre para ver tu estado...</option>' + options;
        this.memberSelect.value = currSel;
    }

    renderGlobalStats() {
        const totalA = this.app.natillera.totalSavings;
        const totalF = this.app.natillera.commonFund;
        const epMember = this.app.natillera.getEarningsPerMember();

        this.totalSavingsEl.textContent = this.formatMoney(totalA);
        this.totalEarningsEl.textContent = this.formatMoney(totalF);
        this.earningsPerMemberEl.textContent = this.formatMoney(epMember);
    }

    renderPersonalSummary(memberId) {
        const member = this.app.natillera.getMember(memberId);
        const epMember = this.app.natillera.getEarningsPerMember();
        if (member) {
            this.pNumber.textContent = member.id;
            this.pSavings.textContent = this.formatMoney(member.savings);
            this.pTotal.textContent = this.formatMoney(member.savings + epMember);
            
            // Render Historial personal
            if(member.history.length === 0) {
               this.personalHistoryList.innerHTML = `<li style="color:#888;">Sin historial registrado aún.</li>`; 
            } else {
                this.personalHistoryList.innerHTML = member.history.map(h => {
                    let cType = "tx-default";
                    if(h.type === 'ahorro' || h.type === 'abono') cType = 'tx-positive';
                    if(h.type === 'prestamo') cType = 'tx-negative';
                    if(h.type === 'interes') cType = 'tx-warning';
                    
                    return `
                    <li>
                        <span class="ph-date">${h.date}</span> - 
                        <span class="ph-desc">${h.desc}</span> 
                        ${h.amount > 0 ? `<strong class="${cType}">${this.formatMoney(h.amount)}</strong>` : ''}
                    </li>
                `}).join('');
            }

            this.personalSummary.classList.remove("hidden");
            this.personalSummary.classList.add("animate__animated", "animate__bounceIn");
        }
    }

    renderAdminTable(members) {
        this.membersTableBody.innerHTML = '';
        members.forEach(m => {
            const tr = document.createElement("tr");
            
            // Calculo de deuda e intereses para mostrar
            const totalDeuda = m.loans.reduce((acc, l) => acc + l.remaining, 0);
            const totalIntereses = m.loans.reduce((acc, l) => acc + l.interestPaid, 0);
            
            let statusBadge = '';
            if(totalDeuda > 0) statusBadge = `<span class="badge red">Debe ${this.formatMoney(totalDeuda)}</span>`;
            else statusBadge = `<span class="badge green">Limpi@</span>`;

            tr.innerHTML = `
                <td>${m.id}</td>
                <td><strong>${m.name}</strong></td>
                <td>${this.formatMoney(m.savings)}</td>
                <td>${statusBadge} <br> <small style="color:#777">Int. Pagados: ${this.formatMoney(totalIntereses)}</small></td>
                <td>
                    <div class="table-input-group">
                        <input type="number" class="input-control save-input" id="sav_${m.id}" placeholder="+$ Ahorro">
                        <input type="date" class="input-control date-input" id="sdate_${m.id}" value="${new Date().toISOString().split("T")[0]}">
                        <button class="btn primary update-btn" data-id="${m.id}">Add</button>
                        <button class="btn secondary manage-member-btn" data-id="${m.id}" title="Gestionar y Editar">⚙️</button>
                    </div>
                </td>
            `;

            this.membersTableBody.appendChild(tr);
        });

        // Eventos de botones (dentro de RenderAdminTable)
        const updateBtns = document.querySelectorAll('.update-btn');
        updateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute("data-id");
                const val = parseInt(document.getElementById(`sav_${id}`).value) || 0;
                const dDate = document.getElementById(`sdate_${id}`).value;
                if(val > 0) {
                    this.app.natillera.getMember(id).addSavings(val, dDate);
                    this.app.natillera.updateTotalSavings();
                    this.app.saveChanges();
                    alert("Ahorro añadido correctamente a la bitácora.");
                }
            })
        });

        // Eventos a botones Gestionar Integrante
        document.querySelectorAll('.manage-member-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute("data-id");
                this.openManageMemberModal(id);
            });
        });
    }

    openManageMemberModal(memberId) {
        const m = this.app.natillera.getMember(memberId);
        if(!m) return;
        this.currentManageMemberId = memberId;
        this.manageMemberName.textContent = m.name;

        if(m.history.length === 0) {
            this.manageHistoryList.innerHTML = `<li>Sin transacciones.</li>`;
        } else {
            this.manageHistoryList.innerHTML = m.history.map((h, idx) => `
                <li style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span class="ph-date"> ${h.date}</span><br>
                        <strong style="color:var(--text);">${h.desc}</strong>
                        ${h.amount > 0 ? `<br><span style="color:var(--primary);">${this.formatMoney(h.amount)}</span>` : ''}
                    </div>
                    <button class="btn danger btn-sm undo-history-btn" data-mem="${m.id}" data-idx="${idx}">Revertir</button>
                </li>
            `).join('');
        }

        this.memberManageModal.classList.remove("hidden");

        // Bind deshacer histórico
        document.querySelectorAll('.undo-history-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute("data-idx"));
                const memId = e.target.getAttribute("data-mem");

                if(confirm("¿Estás seguro de deshacer esta transacción y descontar el dinero asociado?")) {
                    const status = this.app.natillera.undoMemberEvent(memId, idx);
                    if(status) {
                        this.app.saveChanges();
                        alert("Transacción revertida con éxito.");
                        this.openManageMemberModal(memId); // Refresh modal content
                        this.updateView();
                    }
                }
            });
        })
    }


    renderHistory() {
        const h = this.app.natillera.getAllHistory();
        if(h.length === 0) {
            this.historyList.innerHTML = `<p style="color:#999;">Sin movimientos recientes.</p>`;
            return;
        }

        const isAdmin = localStorage.getItem("natilleraAdminAuth") === "true";

        this.historyList.innerHTML = h.map(item => {
            let cardClass = "";
            if(item.type === 'ahorro') { cardClass = "card-green"; }
            else if(item.type === 'prestamo') { cardClass = "card-red"; }
            else if(item.type === 'abono' || item.type === 'interes') { cardClass = "card-yellow"; }
            else if(item.type === 'polla') { cardClass = "card-purple"; }
            else if(item.type === 'fondo_actividad' || item.type === 'actividad') { cardClass = "card-blue"; }

            let actions = "";
            if(isAdmin) {
                if(item.globalIndex !== undefined) {
                    actions = `
                    <div style="float: right;">
                        <button class="btn info btn-sm e-card-btn" data-type="global" data-idx="${item.globalIndex}" data-amt="${item.amount}" data-desc="${item.desc}" data-date="${item.date}" title="Editar" style="padding: 2px 6px; margin-right: 5px;"></button>
                        <button class="btn danger btn-sm d-card-btn" data-type="global" data-idx="${item.globalIndex}" title="Eliminar" style="padding: 2px 6px;"></button>
                    </div>`;
                } else if(item.memberIndex !== undefined) {
                    actions = `
                    <div style="float: right;">
                        <button class="btn info btn-sm e-card-btn" data-type="member" data-mid="${item.memberId}" data-idx="${item.memberIndex}" data-amt="${item.amount}" data-desc="${item.desc}" data-date="${item.date}" title="Editar" style="padding: 2px 6px; margin-right: 5px;"></button>
                        <button class="btn danger btn-sm d-card-btn" data-type="member" data-mid="${item.memberId}" data-idx="${item.memberIndex}" title="Eliminar" style="padding: 2px 6px;"></button>
                    </div>`;
                }
            }

            return `
            <div class="history-item ${cardClass} animate__animated animate__fadeIn">
                ${actions}
                <div class="h-date"> ${item.date}</div>
                <div class="h-amount">${item.amount > 0 ? this.formatMoney(item.amount) : ''}</div>
                <div class="h-desc">${item.memberName ? `<strong>${item.memberName}</strong>: ` : ''}${item.desc}</div>
            </div>
            `
        }).join('');

        if(isAdmin) {
            document.querySelectorAll('.d-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const btnEl = e.target.closest('.d-card-btn');
                    if(confirm("¿Estás seguro de ELIMINAR esta transacción (y revertir el dinero asociado)?")) {
                        const type = btnEl.getAttribute('data-type');
                        const idx = parseInt(btnEl.getAttribute('data-idx'));
                        
                        let ok = false;
                        if(type === 'global') {
                            ok = this.app.natillera.deleteGlobalEventByIndex(idx) !== null;
                        } else {
                            const mid = btnEl.getAttribute('data-mid');
                            ok = this.app.natillera.undoMemberEvent(mid, idx);
                        }
                        
                        if(ok) {
                            this.app.saveChanges();
                            alert("Transacción eliminada con éxito.");
                        } else {
                            alert("No se pudo eliminar.");
                        }
                    }
                });
            });

            document.querySelectorAll('.e-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const btnEl = e.target.closest('.e-card-btn');
                    const type = btnEl.getAttribute('data-type');
                    const idx = parseInt(btnEl.getAttribute('data-idx'));
                    const mid = btnEl.getAttribute('data-mid');
                    
                    const oldAmt = parseInt(btnEl.getAttribute('data-amt')) || 0;
                    const oldDesc = btnEl.getAttribute('data-desc');
                    const oldDate = btnEl.getAttribute('data-date');
                    
                    const newAmtRaw = prompt("Ingresa el NUEVO VALOR numérico para esta transacción:", oldAmt);
                    if(newAmtRaw === null) return;
                    const newAmt = parseInt(newAmtRaw) || 0;
                    
                    const newDesc = prompt("Ingresa la nueva DESCRIPCIÓN:", oldDesc) || oldDesc;
                    const newDate = prompt("Ingresa la nueva FECHA (YYYY-MM-DD):", oldDate) || oldDate;
                    
                    if(confirm(`Se registrará el ajuste a:\nValor: $${newAmt}\nDetalle: ${newDesc}\n¿Proceder?`)) {
                        let ok = false;
                        if(type === 'global') {
                            ok = this.app.natillera.editGlobalEventByIndex(idx, newAmt, newDesc, newDate);
                        } else {
                            ok = this.app.natillera.editMemberEvent(mid, idx, newAmt, newDesc, newDate);
                        }
                        
                        if(ok) {
                            this.app.saveChanges();
                            alert("Transacción editada con éxito.");
                        } else {
                            alert("Error al editar.");
                        }
                    }
                });
            });
        }
    }


    updateView() {
        const mems = this.app.natillera.getMembers();
        this.renderGlobalStats();
        this.renderDropdowns(mems);
        this.renderHistory();
        this.renderAdminTable(mems);
        
        if(this.memberSelect.value) {
            this.renderPersonalSummary(this.memberSelect.value);
        }
    }

    formatMoney(amount) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
    }
}



