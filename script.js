document.addEventListener("DOMContentLoaded", () => {
    const gridSize = 7;
    const totalShips = 7;
    let naviG1 = [];
    let naviG2 = [];
    let colpiG1 = []; // Colpi di G1 su G2
    let colpiG2 = []; // Colpi di G2 su G1
    let turno = "g1";
    let attaccoCompletato = false;

    const grigliaG1 = document.getElementById("griglia-g1");
    const grigliaG2 = document.getElementById("griglia-g2");
    const grigliaAttacco = document.getElementById("griglia-attacco");
    const passaG2 = document.getElementById("passa-g2");
    const iniziaBattaglia = document.getElementById("inizia-battaglia");
    const passaTurno = document.getElementById("passa-turno");
    const messaggioVittoria = document.getElementById("vittoria");
    const vincitore = document.getElementById("vincitore");
    const turnoAttacco = document.getElementById("turno-attacco");

    function creaGriglia(griglia, tipo, naviAvversario = [], colpi = []) {
        griglia.innerHTML = '';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cella = document.createElement("div");
            cella.dataset.index = i;
            const colpo = colpi.find(c => c.index === i);
            if (colpo) {
                cella.classList.add(colpo.result);
            }
            griglia.appendChild(cella);

            if (tipo === "posiziona") {
                cella.addEventListener("click", () => posizionaNave(cella));
            } else if (tipo === "attacco") {
                cella.addEventListener("click", () => {
                    if (!attaccoCompletato && !cella.classList.contains("hit") && !cella.classList.contains("miss")) {
                        attacca(cella, naviAvversario, colpi);
                    }
                });
            }
        }
    }

    function posizionaNave(cella) {
        const index = parseInt(cella.dataset.index);
        if (turno === "g1" && naviG1.length < totalShips && !naviG1.includes(index)) {
            naviG1.push(index);
            cella.classList.add("ship");
            if (naviG1.length === totalShips) passaG2.style.display = "block";
        } else if (turno === "g2" && naviG2.length < totalShips && !naviG2.includes(index)) {
            naviG2.push(index);
            cella.classList.add("ship");
            if (naviG2.length === totalShips) iniziaBattaglia.style.display = "block";
        }
    }

    function attacca(cella, naviAvversario, colpi) {
        const index = parseInt(cella.dataset.index);
        const result = naviAvversario.includes(index) ? "hit" : "miss";
        cella.classList.add(result);
        colpi.push({ index, result });

        // Verifica la vittoria dopo ogni colpo
        if (verificaVittoria(naviAvversario, colpi)) {
            return; // Interrompi se c'è una vittoria
        }

        // Gestione del turno
        if (result === "hit") {
            // Colpo riuscito: il giocatore può colpire di nuovo
            attaccoCompletato = false;
            passaTurno.style.display = "none";
        } else {
            // Colpo mancato: passa il turno
            attaccoCompletato = true;
            passaTurno.style.display = "block";
        }
    }

    function verificaVittoria(naviAvversario, colpi) {
        const colpiRiusciti = colpi.filter(c => c.result === "hit").length;
        console.log(`Turno: ${turno}, Colpi riusciti: ${colpiRiusciti}, Nav皆Avversarie: ${naviAvversario.length}`);
        if (colpiRiusciti >= naviAvversario.length) {
            vincitore.innerText = turno === "g1" ? "1" : "2";
            messaggioVittoria.style.display = "block";
            document.getElementById("fase-attacco").style.display = "none";
            console.log(`Vittoria! Giocatore ${turno === "g1" ? "1" : "2"} ha vinto.`);
            attaccoCompletato = true; // Impedisci ulteriori attacchi
            return true; // Indica che il gioco è finito
        }
        return false;
    }

    passaG2.addEventListener("click", () => {
        document.getElementById("fase-posiziona-g1").style.display = "none";
        document.getElementById("fase-posiziona-g2").style.display = "block";
        turno = "g2";
        creaGriglia(grigliaG2, "posiziona");
    });

    iniziaBattaglia.addEventListener("click", () => {
        document.getElementById("fase-posiziona-g2").style.display = "none";
        document.getElementById("fase-attacco").style.display = "block";
        turno = "g1";
        attaccoCompletato = false;
        turnoAttacco.innerHTML = "Giocatore 1, Attacca!";
        creaGriglia(grigliaAttacco, "attacco", naviG2, colpiG1);
    });

    passaTurno.addEventListener("click", () => {
        attaccoCompletato = false;
        passaTurno.style.display = "none";
        turno = turno === "g1" ? "g2" : "g1";
        turnoAttacco.innerHTML = `Giocatore ${turno === "g1" ? "1" : "2"}, Attacca!`;
        const naviAvversario = turno === "g1" ? naviG2 : naviG1;
        const colpi = turno === "g1" ? colpiG1 : colpiG2;
        creaGriglia(grigliaAttacco, "attacco", naviAvversario, colpi);
    });

    window.resetGame = () => {
        naviG1 = [];
        naviG2 = [];
        colpiG1 = [];
        colpiG2 = [];
        turno = "g1";
        attaccoCompletato = false;
        document.getElementById("fase-posiziona-g1").style.display = "block";
        document.getElementById("fase-posiziona-g2").style.display = "none";
        document.getElementById("fase-attacco").style.display = "none";
        messaggioVittoria.style.display = "none";
        passaG2.style.display = "none";
        iniziaBattaglia.style.display = "none";
        passaTurno.style.display = "none";
        creaGriglia(grigliaG1, "posiziona");
    };

    creaGriglia(grigliaG1, "posiziona");
});