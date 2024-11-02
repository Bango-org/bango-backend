import * as readline from 'readline-sync';

// Interfaces and Types
type Outcome = 'Yes' | 'No';

interface Shares {
    Yes: number;
    No: number;
}

interface UserData {
    usdt: number;
    shares: { [eventId: string]: Shares };
    winnings: number;
}

interface EventData {
    eventId: string;
    creator: string;
    outcomes: Outcome[];
    shares: Shares;
    totalShares: number;
    feesCollected: number;
    isSettled: boolean;
    winningOutcome: Outcome | null;
}

class Event implements EventData {
    public eventId: string;
    public creator: string;
    public outcomes: Outcome[];
    public shares: Shares;
    public totalShares: number;
    public feesCollected: number;
    public isSettled: boolean;
    public winningOutcome: Outcome | null;

    constructor(eventId: string, creator: string, outcomes: Outcome[]) {
        this.eventId = eventId;
        this.creator = creator;
        this.outcomes = outcomes;
        this.shares = { Yes: 1000, No: 1000 };
        this.totalShares = this.shares.Yes + this.shares.No;
        this.feesCollected = 0;
        this.isSettled = false;
        this.winningOutcome = null;
    }

    getPrice(outcome: Outcome): number {
        return this.shares[outcome] / this.totalShares;
    }

    updateTotalShares(): void {
        this.totalShares = this.shares.Yes + this.shares.No;
    }

    adjustShares(outcome: Outcome, amount: number): void {
        this.shares[outcome] += amount;
        this.updateTotalShares();
    }

    settleEvent(winningOutcome: Outcome): void {
        this.isSettled = true;
        this.winningOutcome = winningOutcome;
        console.log(`Event ${this.eventId} settled. Winning outcome: ${winningOutcome}`);
    }
}

class PredictionMarket {
    private events: { [eventId: string]: Event };
    private users: { [username: string]: UserData };

    constructor() {
        this.events = {};
        this.users = {};
    }

    createEvent(eventId: string, creator: string): void {
        if (this.events[eventId]) {
            console.log(`Event ${eventId} already exists.`);
            return;
        }
        this.events[eventId] = new Event(eventId, creator, ['Yes', 'No']);
        this.addUser(creator, 0); // Add creator if not present
        console.log(`Event ${eventId} created by ${creator} with outcomes Yes and No.`);
    }

    addUser(username: string, usdtAmount: number): void {
        if (!this.users[username]) {
            this.users[username] = {
                usdt: usdtAmount,
                shares: {},
                winnings: 0
            };
            console.log(`${username} added with ${usdtAmount} USDT.`);
        }
        else {
          console.log("error")
        }
    }

    buyShares(username: string, eventId: string, outcome: Outcome, usdtAmount: number): void {
        const user = this.users[username];
        const event = this.events[eventId];
        if (!user || !event || event.isSettled) {
            console.log("Invalid user or event, or event is already settled.");
            return;
        }
        if (user.usdt < usdtAmount) {
            console.log("Insufficient USDT balance.");
            return;
        }

        // Calculate fee and shares to buy after fee
        const fee = usdtAmount * 0.02;
        const netAmount = usdtAmount - fee;
        const sharesToBuy = netAmount / event.getPrice(outcome);

        // Adjust shares and accumulate fees
        event.adjustShares(outcome, sharesToBuy);
        event.feesCollected += fee;

        // Update user balances
        user.usdt -= usdtAmount;
        user.shares[eventId] = user.shares[eventId] || { Yes: 0, No: 0 };
        user.shares[eventId][outcome] += sharesToBuy;

        console.log(`${username} bought ${sharesToBuy.toFixed(2)} shares of ${outcome} in ${eventId} for ${usdtAmount} USDT (including 2% fee).`);
    }

    sellShares(username: string, eventId: string, outcome: Outcome, sharesToSell: number): void {
        const user = this.users[username];
        const event = this.events[eventId];
        if (!user || !event || event.isSettled) {
            console.log("Invalid user or event, or event is already settled.");
            return;
        }
        if (!user.shares[eventId] || user.shares[eventId][outcome] < sharesToSell) {
            console.log("Insufficient shares to sell.");
            return;
        }

        // Calculate USDT amount to receive after fee
        const usdtAmount = sharesToSell * event.getPrice(outcome);
        const fee = usdtAmount * 0.02;
        const netAmount = usdtAmount - fee;

        // Adjust shares and accumulate fees
        event.adjustShares(outcome, -sharesToSell);
        event.feesCollected += fee;

        // Update user balances
        user.usdt += netAmount;
        user.shares[eventId][outcome] -= sharesToSell;

        console.log(`${username} sold ${sharesToSell.toFixed(2)} shares of ${outcome} in ${eventId} for ${netAmount.toFixed(2)} USDT (after 2% fee).`);
    }

    showUserBalance(username: string): void {
        const user = this.users[username];
        if (!user) {
            console.log("User not found.");
            return;
        }
        console.log(`${username} Balance: ${user.usdt.toFixed(2)} USDT`);
        console.log("Shares:");
        for (const eventId in user.shares) {
            console.log(`  Event ${eventId}: Yes - ${user.shares[eventId].Yes.toFixed(2)}, No - ${user.shares[eventId].No.toFixed(2)}`);
        }
        console.log(`Total Winnings: ${user.winnings.toFixed(2)} USDT`);
    }

    showEventPrices(eventId: string): void {
        const event = this.events[eventId];
        if (!event) {
            console.log("Event not found.");
            return;
        }
        console.log(`Prices for Event ${eventId}:`);
        console.log(`  Yes: ${event.getPrice("Yes").toFixed(4)} USDT`);
        console.log(`  No: ${event.getPrice("No").toFixed(4)} USDT`);
    }

    endEvent(eventId: string, winningOutcome: Outcome): void {
        const event = this.events[eventId];
        if (!event || event.isSettled) {
            console.log("Invalid event or event is already settled.");
            return;
        }

        // Settle the event with the winning outcome
        event.settleEvent(winningOutcome);

        // Calculate the losing pool
        const losingOutcome: Outcome = winningOutcome === "Yes" ? "No" : "Yes";
        const totalLosingShares = event.shares[losingOutcome];
        const losingPool = totalLosingShares * event.getPrice(losingOutcome);

        // Transfer the losing pool to the winning outcome
        const totalWinningShares = event.shares[winningOutcome];
        const winningPool = totalWinningShares + losingPool;

        // Calculate creator commission (5% of the winning pool)
        const creatorPayout = winningPool * 0.05;
        const userPayoutPool = winningPool - creatorPayout;

        // Distribute creator payout
        this.users[event.creator].usdt += creatorPayout;
        console.log(`${event.creator} (creator) received a 5% fee from winning pool: ${creatorPayout.toFixed(2)} USDT`);

        // Distribute user winnings proportionally
        for (const username in this.users) {
            const userShares = this.users[username].shares[eventId]?.[winningOutcome] || 0;
            if (userShares > 0) {
                const userPayout = (userShares / totalWinningShares) * userPayoutPool;
                this.users[username].winnings += userPayout;
                console.log(`${username} received ${userPayout.toFixed(2)} USDT from the winning pool.`);
            }
        }
    }
}

// Initialize Prediction Market
const market = new PredictionMarket();

// Command interface
function runCommandInterface(): void {
    while (true) {
        const command = readline.question("Enter command: ");
        const args = command.split(" ");

        switch (args[0]) {
            case "create_event":
                market.createEvent(args[1], args[2]);
                break;
            case "add_user":
                market.addUser(args[1], parseFloat(args[2]));
                break;
            case "buy":
                market.buyShares(args[1], args[2], args[3] as Outcome, parseFloat(args[4]));
                break;
            case "sell":
                market.sellShares(args[1], args[2], args[3] as Outcome, parseFloat(args[4]));
                break;
            case "balance":
                market.showUserBalance(args[1]);
                break;
            case "prices":
                market.showEventPrices(args[1]);
                break;
            case "end_event":
                market.endEvent(args[1], args[2] as Outcome);
                break;
            case "exit":
                console.log("Exiting...");
                return;
            default:
                console.log("Invalid command.");
        }
    }
}

// Print commands list
console.log("Commands:");
console.log("  create_event <eventId> <creator>");
console.log("  add_user <username> <usdtAmount>");
console.log("  buy <username> <eventId> <outcome> <usdtAmount>");
console.log("  sell <username> <eventId> <outcome> <sharesToSell>");
console.log("  balance <username>");
console.log("  prices <eventId>");
console.log("  end_event <eventId> <winningOutcome>");
console.log("  exit");

runCommandInterface();