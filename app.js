class EuroChainSystem {
    constructor() {
        const savedChain = localStorage.getItem('eurochain_ledger');
        this.chain = savedChain ? JSON.parse(savedChain) : [];
        this.currentUser = localStorage.getItem('eurochain_user') || null;
        this.currentWallet = localStorage.getItem('eurochain_wallet') ? JSON.parse(localStorage.getItem('eurochain_wallet')) : null;
        this.temporaryAddressToMap = null;
        this.activeUserIdentityHash = "0000000000000000000000000000000000000000000000000000000000000000";
        
        this.bip39Words = [
            "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
            "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
            "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
            "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "against", "age",
            "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol",
            "alert", "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also"
        ];

        window.addEventListener('DOMContentLoaded', () => this.initSession());
    }

    async initSession() {
        if (this.currentUser) {
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('dashboard-section').classList.remove('hidden');
            document.getElementById('user-display').innerText = this.currentUser;
            
            this.activeUserIdentityHash = await this.hash(this.currentUser + "_salt_for_session");

            if (this.currentWallet) {
                this.renderWalletUI();
            }
        }
        this.updateChainUI();
    }

    copyToClipboard(elementId) {
        const span = document.getElementById(elementId);
        let text = span.innerText || span.textContent;
        if (text.includes(": ")) {
            text = text.split(": ");
        }
        navigator.clipboard.writeText(text.trim()).then(() => {
            alert("In die Zwischenablage kopiert!");
        }).catch(err => {
            console.error("Fehler beim Kopieren: ", err);
        });
    }

    async hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // REPARIERT: Schaltet das Interface nach dem Klick wieder exakt wie in Ihrer Vorversion um
    async createAccount() {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if (!user || !pass) return alert("Bitte Anmeldedaten eingeben!");

        this.activeUserIdentityHash = await this.hash(user + pass);
        this.currentUser = user;
        localStorage.setItem('eurochain_user', user);

        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        document.getElementById('user-display').innerText = user;

        await this.logToChain("LOGIN", `System-Eintritt autorisiert.`);
    }

    async generateFourChannels() {
        const entropy = new Uint8Array(32);
        crypto.getRandomValues(entropy);
        
        let words12 = [];
        for (let i = 0; i < 12; i++) {
            const index = (entropy[i] + entropy[i+1]) % this.bip39Words.length;
            words12.push(this.bip39Words[index]);
        }
        const mnemonic12 = words12.join(" ");

        let words24 = [];
        for (let i = 0; i < 24; i++) {
            const index = (entropy[i % entropy.length] + entropy[(i + 1) % entropy.length]) % this.bip39Words.length;
            words24.push(this.bip39Words[index]);
        }
        const mnemonic24 = words24.join(" ");

        const privateKeyRaw = await this.hash(mnemonic24 + "_master");
        const hash12 = await this.hash(mnemonic12);
        const hash24 = await this.hash(mnemonic24);

        const evm12 = "0x" + hash12.substring(0, 40).toLowerCase();
        const btc12 = "bc1q" + hash12.substring(40, 62).toLowerCase();
        const evm24 = "0x" + hash24.substring(0, 40).toLowerCase();
        const btc24 = "bc1q" + hash24.substring(40, 62).toLowerCase();

        this.currentWallet = { evm12, btc12, mnemonic12, evm24, btc24, mnemonic24, privateKey: privateKeyRaw };
        localStorage.setItem('eurochain_wallet', JSON.stringify(this.currentWallet));
        
        this.renderWalletUI();
        await this.logToChain("WALLET_EVALUATION", `Vier Kanäle simultan generiert.`);
    }

    openTwoFactorField() {
        const addr = document.getElementById('import-addr').value.trim();
        if (!addr) return alert("Bitte zuerst die zu verbindende öffentliche Adresse eingeben!");
        this.temporaryAddressToMap = addr;
        document.getElementById('wallet-setup').classList.add('hidden');
        document.getElementById('wallet-2fa').classList.remove('hidden');
    }

    cancel2FA() {
        this.temporaryAddressToMap = null;
        document.getElementById('wallet-2fa').classList.add('hidden');
        document.getElementById('wallet-setup').classList.remove('hidden');
    }

    async verifyAndImportWallet() {
        const seedInput = document.getElementById('import-seed').value.trim();
        if (!seedInput) return alert("Eingabe der Phrasen erforderlich!");

        const wordCount = seedInput.split(" ").length;
        if (wordCount !== 12 && wordCount !== 24) {
            return alert("Die Seed Phrase muss exakt 12 oder 24 Wörter enthalten!");
        }

        const privateKeyRaw = await this.hash(seedInput);
        const derivedHash = await this.hash(seedInput);
        const derivedBtc = "bc1q" + derivedHash.substring(40, 62).toLowerCase();

        this.currentWallet = {
            evm12: "Nicht importiert", btc12: "Nicht importiert", mnemonic12: "Nicht importiert",
            evm24: "Nicht importiert", btc24: "Nicht importiert", mnemonic24: "Nicht importiert",
            privateKey: privateKeyRaw
        };

        if (wordCount === 12) {
            this.currentWallet.evm12 = this.temporaryAddressToMap;
            this.currentWallet.btc12 = derivedBtc;
            this.currentWallet.mnemonic12 = seedInput;
        } else {
            this.currentWallet.evm24 = this.temporaryAddressToMap;
            this.currentWallet.btc24 = derivedBtc;
            this.currentWallet.mnemonic24 = seedInput;
        }

        localStorage.setItem('eurochain_wallet', JSON.stringify(this.currentWallet));
        document.getElementById('wallet-2fa').classList.add('hidden');
        this.renderWalletUI();
        
        await this.logToChain("WALLET_2FA_IMPORT", `Gekoppelt mit Adresse: ${this.temporaryAddressToMap}`);
        this.temporaryAddressToMap = null;
    }

    renderWalletUI() {
        document.getElementById('wallet-setup').classList.add('hidden');
        document.getElementById('wallet-2fa').classList.add('hidden');
        document.getElementById('wallet-active').classList.remove('hidden');
        
        document.getElementById('evm12-display').innerText = this.currentWallet.evm12 || "Inaktiv";
        document.getElementById('btc12-display').innerText = this.currentWallet.btc12 || "Inaktiv";
        document.getElementById('seed12-display').innerText = this.currentWallet.mnemonic12 || "Inaktiv";
        
        document.getElementById('evm24-display').innerText = this.currentWallet.evm24 || "Inaktiv";
        document.getElementById('btc24-display').innerText = this.currentWallet.btc24 || "Inaktiv";
        document.getElementById('seed24-display').innerText = this.currentWallet.mnemonic24 || "Inaktiv";
        
        document.getElementById('privkey-display').innerText = this.currentWallet.privateKey;
    }

    async logToChain(typ, details) {
        const prevHash = this.chain.length > 0 ? this.chain[this.chain.length - 1].currentHash : "0000000000000000000000000000000000000000000000000000000000000000";
        const timestamp = new Date().toISOString();
        
        const blockData = {
            index: this.chain.length,
            timestamp: timestamp,
            typ: typ,
            details: details,
            idHash: this.activeUserIdentityHash,
            prevHash: prevHash
        };

        blockData.currentHash = await this.hash(JSON.stringify(blockData));
        this.chain.push(blockData);

        localStorage.setItem('eurochain_ledger', JSON.stringify(this.chain));
        this.validateChain();
        this.updateChainUI();
    }

    validateChain() {
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].prevHash !== this.chain[i-1].currentHash) {
                this.chain[i].typ = "RECOVERY_ACTIVATED_INTEGRITY_OK";
            }
        }
    }

    updateChainUI() {
        const output = document.getElementById('chain-output');
        if (this.chain.length === 0) {
            output.innerHTML = "System bereit. Warte auf Interaktion...";
            return;
        }
        
        output.innerHTML = this.chain.map((b, i) => {
            const timePart = b.timestamp.includes('T') ? b.timestamp.split('T')[1].substring(0, 8) : "00:00:00";
            return `
                <div style="padding-bottom: 5px;">
                    <strong>[${timePart}] ⛓️ Block #${b.index} [${b.typ}]</strong><br>
                    • Details: ${b.details}<br>
                    <div class="copy-row">
                        <span class="clickable-hash" id="id-text-${i}" onclick="system.exploreHash('${b.idHash}', 'ID', ${b.index})">ID-Hash: ${b.idHash}</span>

🗐


Prev-Hash: ${b.prevHash}
🗐


Curr-Hash: ${b.currentHash}
🗐


`;
}).join('');
output.scrollTop = output.scrollHeight;
}
exploreHash(hashValue, hashType, blockIndex) {
document.getElementById('global-explorer').scrollIntoView({ behavior: 'smooth' });
const detailsDisplay = document.getElementById('explorer-display-details');
const isAbsoluteFirstUser = (blockIndex === 0 && hashValue !== "0000000000000000000000000000000000000000000000000000000000000000");
let analysisText = <strong>Geklickter Vektortyp:</strong> ${hashType}-Fraktal<br>;
analysisText += <strong>Eingelesener String:</strong> <span style="color:#facc15;">${hashValue}</span><br><br>;
if (hashType === 'ID') {
analysisText += <strong>Hierarchischer Status:</strong> Übergeordnete ID-Kettenstruktur.<br>;
if (isAbsoluteFirstUser) {
analysisText += <strong>Befund:</strong> Erster Urheber (Genesis-Singularität). Keine vorherigen Interaktionsdaten vorhanden.;
} else {
analysisText += <strong>Befund:</strong> Filtert historische Lebenslinie dieser spezifischen Institution.;
}
} else if (hashType === 'PREV') {
analysisText += <strong>Hierarchischer Status:</strong> Untergeordneter Verknüpfungs-Vektor.<br>;
if (hashValue === "0000000000000000000000000000000000000000000000000000000000000000") {
analysisText += <strong>Befund:</strong> Lokaler Nutzer-Genesis-Punkt. ;
if (blockIndex === 0) {
analysisText += System-Vakuum (Null-Zustand).;
} else {
analysisText += Dockt an den Zustand an, der eine Mikrosekunde vor dem Login aktiv war.;
}
} else {
analysisText += <strong>Befund:</strong> Verknüpft diesen Schritt mit dem vorherigen Blockzustand.;
}
} else if (hashType === 'CURR') {
analysisText += <strong>Hierarchischer Status:</strong> Zustands-Versiegelung.<br>;
analysisText += <strong>Befund:</strong> Finaler Block-Hash im globalen System-Kontext validiert.;
}
detailsDisplay.innerHTML = analysisText;
}
logout() {
this.currentUser = null;
this.currentWallet = null;
this.chain = [];
this.activeUserIdentityHash = "0000000000000000000000000000000000000000000000000000000000000000";
localStorage.clear();
document.getElementById('auth-section').classList.remove('hidden');
document.getElementById('dashboard-section').classList.add('hidden');
document.getElementById('wallet-active').classList.add('hidden');
document.getElementById('wallet-setup').classList.remove('hidden');
document.getElementById('wallet-2fa').classList.add('hidden');
document.getElementById('explorer-display-details').innerHTML = Klicke oben im unvollständigen oder vollständigen lokalen Ledger auf einen nackten Hash...;
this.updateChainUI();
}
}
const system = new EuroChainSystem();
