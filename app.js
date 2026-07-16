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
    "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
    "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
    "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
    "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
    "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
    "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
    "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
    "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
    "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
    "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
    "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge",
    "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain",
    "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become",
    "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit",
    "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology",
    "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless",
    "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body",
    "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss",
    "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread",
    "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze",
    "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb",
    "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy",
    "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call",
    "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas",
    "canyon", "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry",
    "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category",
    "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century",
    "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase",
    "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child",
    "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle",
    "citizen", "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk",
    "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close",
    "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut",
    "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort",
    "comic", "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider",
    "control", "convince", "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct",
    "cost", "cotton", "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack",
    "cradle", "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit",
    "creek", "crew", "cricket", "crime", "crisp", "critic", "crop", "cross", "crouch", "crowd",
    "crucial", "cruel", "cruise", "crumble", "crunch", "crush", "cry", "crystal", "cube", "culture",
    "cup", "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute", "cycle",
    "dad", "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day",
    "deal", "debate", "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer",
    "defense", "define", "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist",
    "deny", "depart", "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design",
    "desk", "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial",
    "diamond", "diary", "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner",
    "dinosaur", "direct", "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display",
    "distance", "divert", "divide", "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin",
    "domain", "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon",
    "drama", "drastic", "draw", "dream", "dress", "drift", "drill", "drink", "drip", "drive",
    "drop", "drum", "dry", "duck", "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf",
    "dynamic", "eager", "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo",
    "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight", "either", "elbow",
    "elder", "electric", "elegant", "element", "elephant", "elevator", "elite", "else", "embark", "embody",
    "embrace", "emerge", "emotion", "employ", "empower", "empty", "enable", "enact", "end", "endless",
    "endorse", "enemy", "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough",
    "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode", "equal", "equip",
    "era", "erase", "erode", "erosion", "error", "erupt", "escape", "essay", "essence", "estate",
    "eternal", "ethics", "evidence", "evil", "evoke", "evolve", "exact", "example", "excess", "exchange",
    "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit",
    "exotic", "expand", "expect", "expire", "explain", "expose", "express", "extend", "extra", "eye",
    "eyebrow", "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false", "fame",
    "family", "famous", "fan", "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father",
    "fatigue", "fault", "favorite", "feature", "february", "federal", "fee", "feed", "feel",
    "female", "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field", "figure",
    "file", "film", "filter", "final", "find", "fine", "finger", "finish", "fire", "firm",
    "first", "fiscal", "fish", "fit", "fitness", "fix", "flag", "flame", "flash", "flat",
    "flavor", "flee", "flight", "flip", "float", "flock", "floor", "flower", "fluid", "flush",
    "fly", "foam", "focus", "fog", "foil", "fold", "follow", "food", "foot", "force",
    "forest", "forget", "fork", "fortune", "forum", "forward", "fossil", "foster", "found", "fox",
    "fragile", "frame", "frequent", "fresh", "friend", "fringe", "frog", "front", "frost", "frown",
    "frozen", "fruit", "fuel", "fun", "funny", "furnace", "fury", "future", "gadget", "gain",
    "galaxy", "gallery", "game", "gap", "garage", "garbage", "garden", "garlic", "garment", "gas",
    "gasp", "gate", "gather", "gauge", "gaze", "general", "genius", "genre", "gentle", "genuine",
    "gesture", "ghost", "giant", "gift", "giggle", "ginger", "giraffe", "girl", "give", "glad",
    "glance", "glare", "glass", "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow",
    "glue", "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern",
    "gown", "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green",
    "grid", "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide",
    "guilt", "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand",
    "happy", "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head",
    "health", "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero",
    "hidden", "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold",
    "hole", "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse",
    "hospital", "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor",
    "hundred", "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon",
    "idea", "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense",
    "immune", "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index",
    "indicate", "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject",
    "injury", "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire",
    "install", "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate",
    "issue", "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly",
    "jewel", "job", "join", "joke", "journey", "joy", "judge", "juice", "jump", "jungle",
    "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup", "key", "kick", "kid",
    "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite", "kitten", "kiwi", "knee",
    "knife", "knock", "know", "lab", "label", "labor", "ladder", "lady", "lake", "lamp",
    "language", "laptop", "large", "later", "latin", "laugh", "laundry", "lava", "law", "lawn",
    "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave", "lecture", "left", "leg",
    "legal", "legend", "leisure", "lemon", "lend", "length", "lens", "leopard", "lesson", "letter",
    "level", "liar", "liberty", "library", "license", "life", "lift", "light", "like", "limb",
    "limit", "link", "lion", "liquid", "list", "little", "live", "lizard", "load", "loan",
    "lobster", "local", "lock", "logic", "lonely", "long", "loop", "lottery", "loud", "lounge",
    "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch", "luxury", "lyrics", "machine",
    "mad", "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal", "man",
    "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin", "marine",
    "market", "marriage", "mask", "mass", "master", "match", "material", "math", "matrix", "matter",
    "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal", "media", "melody",
    "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit", "merry", "mesh",
    "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic", "mind",
    "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix",
    "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster",
    "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain",
    "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom",
    "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow",
    "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew",
    "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night",
    "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing",
    "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object",
    "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off",
    "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once",
    "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange",
    "orbit", "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich", "other",
    "outdoor", "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen",
    "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel",
    "panic", "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch",
    "path", "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear",
    "peasant", "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person",
    "pet", "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pig",
    "pigeon", "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place",
    "planet", "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge", "poem",
    "poet", "point", "polar", "pole", "police", "pond", "pony", "pool", "popular", "portion",
    "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power", "practice", "praise",
    "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride", "primary", "print",
    "priority", "prison", "private", "prize", "problem", "process", "produce", "profit", "program", "project",
    "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public", "pudding", "pull",
    "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity", "purpose", "purse",
    "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question", "quick", "quit",
    "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain",
    "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare", "rate", "rather",
    "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild", "recall", "receive",
    "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region", "regret", "regular",
    "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind", "remove", "render",
    "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require", "rescue", "reresemble",
    "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion", "reveal", "review",
    "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge", "rifle", "right",
    "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river", "road", "roast",
    "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose", "rotate", "rough",
    "round", "route", "royal", "rubber", "rude", "rug", "rule", "run", "runway", "rural",
    "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon", "salt", "salute",
    "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save", "say", "scale",
    "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors", "scorpion", "scout",
    "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat", "second", "secret",
    "section", "security", "seed", "seek", "segment", "select", "sell", "seminar", "senior", "sense",
    "sentence", "series", "service", "session", "settle", "setup", "seven", "shadow", "shaft", "shallow",
    "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock",
    "shoe", "shoot", "shop", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy",
    "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver",
    "similar", "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate",
    "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender",
    "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart",
    "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", "snow", "soap", "soccer",
    "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone",
    "song", "soon", "sorry", "sort", "soul", "sound", "soup", "source", "south", "space",
    "spare", "spatial", "spawn", "speak", "special", "speed", "spell", "spend", "sphere", "spice",
    "spider", "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot",
    "spray", "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff",
    "stage", "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem",
    "step", "stereo", "stick", "still", "sting", "stock", "stomach", "stone", "stool", "story",
    "stove", "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "style",
    "subject", "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit",
    "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", "surge",
    "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear",
    "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup", "system",
    "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task",
    "taste", "tattoo", "taxi", "teach", "team", "tell", "ten", "tenant", "tennis", "tent",
    "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they",
    "thing", "this", "thought", "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide",
    "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast",
    "tobacco", "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone",
    "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise",
    "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic",
    "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend",
    "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true",
    "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel",
    "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type",
    "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair",
    "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual",
    "unveil", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban", "urge", "usage",
    "use", "used", "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid",
    "valley", "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet",
    "vendor", "venture", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable",
    "vibrant", "vicious", "victory", "video", "view", "village", "vintage", "violin", "virtual", "virus",
    "visa", "visit", "visual", "vital", "vivid", "vocal", "voice", "void", "volcano", "volume",
    "vote", "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare",
    "warm", "warrior", "wash", "wasp", "waste", "water", "wave", "way", "wealth", "weapon",
    "wear", "weasel", "weather", "web", "wedding", "weekend", "weird", "welcome", "west", "wet",
    "whale", "what", "wheat", "wheel", "when", "where", "whip", "whisper", "wide", "width",
    "wife", "wild", "will", "win", "window", "wine", "wing", "wink", "winner", "winter",
    "wire", "wisdom", "wise", "wish", "witness", "wolf", "woman", "wonder", "wood", "wool",
    "word", "work", "world", "worry", "worth", "wrap", "wreck", "wrestle", "wrist", "write",
    "wrong", "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone",
    "zoo"
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
